
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "./types";
import { Client } from "@/types/client";

type GenerateACFDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClient?: Client;
  onGenerateSuccess: (document: Omit<FiscalDocument, "id">) => void;
};

export function GenerateACFDialog({ 
  open, 
  onOpenChange,
  selectedClient,
  onGenerateSuccess
}: GenerateACFDialogProps) {
  const [validUntil, setValidUntil] = useState<Date | undefined>(
    // Par défaut, expiration dans 1 an
    (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    })()
  );
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client avant de générer une ACF",
        variant: "destructive",
      });
      return;
    }

    if (!referenceNumber) {
      toast({
        title: "Référence requise",
        description: "Veuillez saisir un numéro de référence pour l'ACF",
        variant: "destructive",
      });
      return;
    }

    if (!validUntil) {
      toast({
        title: "Date de validité requise",
        description: "Veuillez sélectionner une date de fin de validité",
        variant: "destructive",
      });
      return;
    }

    // Simulation de génération avec délai
    setIsGenerating(true);
    try {
      // Attendre 1,5 secondes pour simuler un traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer le document fiscal
      const newACF: Omit<FiscalDocument, "id"> = {
        name: `Attestation de Conformité Fiscale (${referenceNumber})`,
        description: `ACF générée pour ${selectedClient.type === 'physique' ? selectedClient.nom : selectedClient.raisonsociale} - NIU: ${selectedClient.niu}`,
        createdAt: new Date(),
        validUntil: validUntil,
      };
      
      // Appeler la fonction de callback avec le nouveau document
      onGenerateSuccess(newACF);
      
      // Réinitialiser le formulaire et fermer le dialogue
      setReferenceNumber("");
      onOpenChange(false);
      
      toast({
        title: "Attestation générée",
        description: "L'Attestation de Conformité Fiscale a été générée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération de l'ACF:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de l'ACF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Générer une Attestation de Conformité Fiscale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleGenerate} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <div className="p-2 bg-muted/40 rounded-md text-sm">
              {selectedClient ? (
                <div>
                  <p className="font-medium">
                    {selectedClient.type === 'physique' ? selectedClient.nom : selectedClient.raisonsociale}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">NIU: {selectedClient.niu}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun client sélectionné</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reference" className="text-right">
              Référence
            </Label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="col-span-3"
              placeholder="Ex: ACF-2024-001"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date de fin de validité</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal col-span-3"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validUntil ? (
                    format(validUntil, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={validUntil}
                  onSelect={setValidUntil}
                  initialFocus
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isGenerating || !selectedClient}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                "Générer l'ACF"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
