
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
import { getClients } from "@/services/clientService";

interface NewFactureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvoice: (formData: any) => void;
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

  const handleSubmit = () => {
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

    const formData = {
      clientId,
      dateEmission,
      dateEcheance,
      prestations: validPrestations,
      notes,
    };
    
    onCreateInvoice(formData);
    resetForm();
  };

  const resetForm = () => {
    setClientId("");
    setDateEmission("");
    setDateEcheance("");
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
