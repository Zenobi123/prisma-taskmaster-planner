
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Client } from "@/types/client";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "./types";

interface GenerateACFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClient?: Client;
  onGenerateSuccess: (newDoc: Omit<FiscalDocument, "id">) => void;
}

export const GenerateACFDialog: React.FC<GenerateACFDialogProps> = ({
  open,
  onOpenChange,
  selectedClient,
  onGenerateSuccess
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)); // Défaut à 1 an
  const [acfType, setAcfType] = useState<"conformite" | "fiscale">("conformite");
  const [reference, setReference] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!date) {
      toast({
        title: "Date manquante",
        description: "Veuillez sélectionner une date de validité.",
        variant: "destructive",
      });
      return;
    }

    // Simuler la génération d'une attestation
    const acfTypeName = acfType === "conformite" ? "Conformité" : "Fiscale";
    const documentName = `Attestation de ${acfTypeName} ${reference ? '- ' + reference : ''}`;
    
    setIsGenerating(true);
    
    try {
      // Créer un nouveau document fiscal
      const newDocument: Omit<FiscalDocument, "id"> = {
        name: documentName,
        description: `Attestation générée pour ${selectedClient?.type === 'physique' ? selectedClient?.nom : selectedClient?.raisonsociale}`,
        createdAt: new Date(),
        validUntil: date
      };
      
      // Appeler la fonction de callback pour enregistrer le document
      await onGenerateSuccess(newDocument);
      
      toast({
        title: `Attestation de ${acfTypeName} générée`,
        description: `L'attestation a été générée avec succès.`,
      });
      
      // Réinitialiser le formulaire et fermer la boîte de dialogue
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la génération de l'attestation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération de l'attestation.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setReference("");
    setDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    setAcfType("conformite");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Générer une Attestation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Type d'attestation</Label>
            <RadioGroup 
              value={acfType} 
              onValueChange={(value) => setAcfType(value as "conformite" | "fiscale")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conformite" id="conformite" />
                <Label htmlFor="conformite">Attestation de Conformité</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fiscale" id="fiscale" />
                <Label htmlFor="fiscale">Attestation Fiscale</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference">Référence</Label>
            <Input 
              id="reference" 
              placeholder="Référence de l'attestation" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date de validité</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className={isGenerating ? "opacity-70" : ""}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              "Générer l'attestation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
