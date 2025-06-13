
import { useToast } from "@/hooks/use-toast";

export function useFactureFormValidation() {
  const { toast } = useToast();

  const validateForm = (formData: any) => {
    if (!formData.clientId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    validateForm,
    toast
  };
}
