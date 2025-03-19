
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Prestation } from "@/types/facture";
import { ClientDateForm } from "./newFacture/ClientDateForm";
import { PrestationsForm } from "./newFacture/PrestationsForm";
import { NotesForm } from "./newFacture/NotesForm";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface NewFactureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvoice: (formData: any) => Promise<boolean>;
}

export const NewFactureDialog = ({
  isOpen,
  onOpenChange,
  onCreateInvoice,
}: NewFactureDialogProps) => {
  const [clientId, setClientId] = useState("");
  const [dateEmission, setDateEmission] = useState("");
  const [dateEcheance, setDateEcheance] = useState("");
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", montant: 0 }
  ]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Définir les dates par défaut lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30); // Date d'échéance par défaut à 30 jours
      
      setDateEmission(today.toISOString().split('T')[0]);
      setDateEcheance(futureDate.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    // Validation des données
    if (!clientId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive"
      });
      return;
    }

    if (!dateEmission) {
      toast({
        title: "Erreur",
        description: "Veuillez définir une date d'émission",
        variant: "destructive"
      });
      return;
    }

    if (!dateEcheance) {
      toast({
        title: "Erreur",
        description: "Veuillez définir une date d'échéance",
        variant: "destructive"
      });
      return;
    }

    // Vérifier qu'il y a au moins une prestation avec description
    const validPrestations = prestations.filter(p => p.description.trim() !== "");
    if (validPrestations.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une prestation avec une description",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = {
        clientId,
        dateEmission,
        dateEcheance,
        prestations: validPrestations,
        notes: notes || "",
      };
      
      console.log("Données envoyées pour création de facture:", formData);
      
      const success = await onCreateInvoice(formData);
      
      if (success) {
        resetForm();
        onOpenChange(false);
        toast({
          title: "Succès",
          description: "La facture a été créée avec succès"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la facture",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClientId("");
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);
    
    setDateEmission(today.toISOString().split('T')[0]);
    setDateEcheance(futureDate.toISOString().split('T')[0]);
    setPrestations([{ description: "", montant: 0 }]);
    setNotes("");
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle facture client.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ClientDateForm 
            clientId={clientId}
            setClientId={setClientId}
            dateEmission={dateEmission}
            setDateEmission={setDateEmission}
            dateEcheance={dateEcheance}
            setDateEcheance={setDateEcheance}
          />
          
          <PrestationsForm 
            prestations={prestations}
            setPrestations={setPrestations}
          />
          
          <NotesForm 
            notes={notes}
            setNotes={setNotes}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer la facture"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
