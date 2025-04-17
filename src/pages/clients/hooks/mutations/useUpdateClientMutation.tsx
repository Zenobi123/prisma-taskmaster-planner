
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { updateClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useUpdateClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      console.log("Updating client with id:", id);
      console.log("Full update data:", JSON.stringify(updates, null, 2));
      console.log("Régime fiscal value:", updates.regimefiscal);
      
      // Garantir que regimefiscal est correctement transmis
      if (updates.regimefiscal) {
        console.log("Régime fiscal is defined as:", updates.regimefiscal);
      } else {
        console.warn("WARNING: Régime fiscal is undefined in updates object");
        
        // Tenter de revenir à une valeur par défaut en fonction du type de client
        if (updates.type) {
          updates.regimefiscal = updates.type === "physique" ? "reel" : "simplifie";
          console.log("Applied fallback regimefiscal value:", updates.regimefiscal);
        }
      }
      
      if (updates.igs) {
        console.log("IGS data to update:", updates.igs);
      }
      
      // Forcer un délai pour s'assurer que la mise à jour est traitée correctement
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // S'assurer que nous passons correctement les données de mise à jour au service
        const updatedClient = await updateClient(id, updates);
        console.log("Client updated successfully:", updatedClient);
        console.log("Updated client's regimefiscal:", updatedClient.regimefiscal);
        return updatedClient;
      } catch (error) {
        console.error("Error in mutation function:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalider et refetch pour s'assurer que nous avons les dernières données
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
