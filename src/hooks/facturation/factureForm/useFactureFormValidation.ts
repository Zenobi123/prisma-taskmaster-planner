
import { FactureFormData } from "./useFactureFormState";
import { Prestation } from "@/types/facture";

export const useFactureFormValidation = () => {
  const validateForm = (data: FactureFormData, prestations: Prestation[], selectedClientId: string | null): string[] => {
    const errors: string[] = [];

    if (!selectedClientId) {
      errors.push("Veuillez sélectionner un client");
    }

    if (!data.date) {
      errors.push("La date est requise");
    }

    if (!data.echeance) {
      errors.push("La date d'échéance est requise");
    }

    if (prestations.length === 0) {
      errors.push("Au moins une prestation est requise");
    }

    prestations.forEach((prestation, index) => {
      if (!prestation.description.trim()) {
        errors.push(`Description requise pour la prestation ${index + 1}`);
      }
      if (prestation.quantite <= 0) {
        errors.push(`Quantité invalide pour la prestation ${index + 1}`);
      }
      if (prestation.prix_unitaire <= 0) {
        errors.push(`Prix unitaire invalide pour la prestation ${index + 1}`);
      }
    });

    return errors;
  };

  return { validateForm };
};
