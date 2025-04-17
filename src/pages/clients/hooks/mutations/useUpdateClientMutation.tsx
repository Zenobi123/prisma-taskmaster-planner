
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { updateClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useUpdateClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      console.log("Mise à jour du client:", { id, updates });
      console.log("Régime fiscal:", updates.regimefiscal);
      
      if (updates.igs) {
        console.log("Données IGS à mettre à jour:", updates.igs);
      }
      
      const updatedClient = await updateClient(id, updates);
      return updatedClient;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      const clientName = data.type === "physique" 
        ? data.nom 
        : data.raisonsociale;
        
      toast({
        title: "Client mis à jour avec succès",
        description: `Les informations de "${clientName}" ont été mises à jour.`,
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour du client. Veuillez vérifier les données et réessayer.",
        variant: "destructive",
      });
    },
  });
}
