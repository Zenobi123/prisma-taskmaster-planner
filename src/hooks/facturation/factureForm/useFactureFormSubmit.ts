
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useFactureFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      console.log("Submitting facture:", formData);
      
      toast({
        title: "Succès",
        description: "Facture créée avec succès",
      });
    } catch (error) {
      console.error("Error submitting facture:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la facture",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting
  };
}
