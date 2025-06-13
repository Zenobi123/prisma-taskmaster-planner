
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFacture, updateFacture } from "@/services/factureService";
import { useToast } from "@/hooks/use-toast";

export function useFactureFormSubmit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: createFacture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Succès",
        description: "Facture créée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la facture",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      updateFacture(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Succès",
        description: "Facture modifiée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la facture",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (id: string, updates: any) => {
    updateMutation.mutate({ id, updates });
  };

  return {
    createMutation,
    updateMutation,
    handleSubmit,
    handleUpdate,
    isSubmitting: createMutation.isPending || updateMutation.isPending
  };
}
