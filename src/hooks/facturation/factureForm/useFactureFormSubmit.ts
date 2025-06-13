
import { useState } from "react";
import { createFacture } from "@/services/factureService";
import { useToast } from "@/components/ui/use-toast";

export function useFactureFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting facture:", formData);
      
      // Validate required fields
      if (!formData.client_id) {
        throw new Error("Client requis");
      }
      
      if (!formData.prestations || formData.prestations.length === 0) {
        throw new Error("Au moins une prestation requise");
      }

      // Calculate total amount from prestations
      const totalAmount = formData.prestations.reduce(
        (sum: number, prestation: any) => sum + (prestation.montant || 0),
        0
      );

      const factureData = {
        ...formData,
        montant: totalAmount
      };

      await createFacture(factureData);
      
      toast({
        title: "Succès",
        description: "Facture créée avec succès",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création de la facture",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
}
