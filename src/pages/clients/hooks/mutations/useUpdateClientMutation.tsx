
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { updateClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useUpdateClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      console.log("Updating client:", { id, updates });
      console.log("Régime fiscal value:", updates.regimefiscal);
      
      // Ensure regimefiscal is properly passed
      if (updates.regimefiscal) {
        console.log("Régime fiscal is defined as:", updates.regimefiscal);
      } else {
        console.warn("WARNING: Régime fiscal is undefined in updates object");
        
        // Attempt to fall back to a default value based on client type if missing
        if (updates.type) {
          updates.regimefiscal = updates.type === "physique" ? "reel" : "simplifie";
          console.log("Applied fallback regimefiscal value:", updates.regimefiscal);
        }
      }
      
      if (updates.igs) {
        console.log("IGS data to update:", updates.igs);
      }
      
      // Force a delay to ensure the update is processed correctly (workaround for race conditions)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Ensure we're correctly passing the update data to the service
      const updatedClient = await updateClient(id, updates);
      console.log("Client updated successfully:", updatedClient);
      console.log("Updated client's regimefiscal:", updatedClient.regimefiscal);
      return updatedClient;
    },
    onSuccess: (data) => {
      // Invalidate and refetch to ensure we have the latest data
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
      console.error("Error updating client:", error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour du client. Veuillez vérifier les données et réessayer.",
        variant: "destructive",
      });
    },
  });
}
