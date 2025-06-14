
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { PaiementFormData } from "../../types/PaiementFormTypes";
import { Paiement, PrestationPayee } from "@/types/paiement";

interface UsePaiementFormSubmitProps {
  clients: any[];
  handleSubmit: any;
  onSubmit: (paiement: Omit<Paiement, "id">) => Promise<any>;
  onOpenChange: (open: boolean) => void;
  reset: any;
  setIsSubmitting: (isSubmitting: boolean) => void;
  prestationAmounts: Record<string, number>;
}

export const usePaiementFormSubmit = ({
  clients,
  handleSubmit,
  onSubmit,
  onOpenChange,
  reset,
  setIsSubmitting,
  prestationAmounts
}: UsePaiementFormSubmitProps) => {
  const { toast } = useToast();

  const onFormSubmit = async (data: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      const clientInfo = clients.find(c => c.id === data.client_id);
      const clientName = clientInfo ? (clientInfo.nom || clientInfo.raisonsociale) : "";
      
      // Create array of prestations with modified amounts
      const prestationsPayees: PrestationPayee[] = data.prestations_payees.map(id => {
        return { 
          id,
          montant_modifie: prestationAmounts[id] || null
        };
      });
      
      const paiementData: Omit<Paiement, "id"> = {
        client: clientName,
        client_id: data.client_id,
        facture: data.est_credit ? "" : data.facture_id,
        date: format(data.date, "yyyy-MM-dd"),
        montant: data.montant,
        mode: data.mode, // Le nom est déjà 'mode' ici, donc pas de changement nécessaire.
        est_credit: data.est_credit,
        reference: `PAY-${Date.now().toString(36)}`,
        reference_transaction: data.reference_transaction,
        notes: data.notes,
        solde_restant: 0, // Sera calculé côté serveur
        type_paiement: data.type_paiement,
        prestations_payees: prestationsPayees
      };

      const result = await onSubmit(paiementData);
      if (result) {
        reset();
        onOpenChange(false);
        toast({
          title: "Succès",
          description: "Le paiement a été enregistré avec succès.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du paiement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onFormSubmit
  };
};
