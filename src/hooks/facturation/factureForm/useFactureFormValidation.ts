
import { useToast } from "@/components/ui/use-toast";
import { Prestation } from "@/types/facture";
import { Client } from "@/types/client";

export const useFactureFormValidation = () => {
  const { toast } = useToast();

  // Validate form data before submission
  const validateFactureForm = (
    selectedClient: Client | undefined, 
    prestations: Prestation[]
  ): boolean => {
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un client.",
      });
      return false;
    }

    if (prestations.some(p => !p.description || p.montant <= 0)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir correctement tous les champs des prestations.",
      });
      return false;
    }

    return true;
  };

  return {
    validateFactureForm,
    toast
  };
};
