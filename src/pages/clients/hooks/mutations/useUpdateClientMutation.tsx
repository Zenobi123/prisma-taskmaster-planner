
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
      
      // Vérification explicite du régime fiscal
      if (!updates.regimefiscal) {
        console.warn("WARNING: Régime fiscal is undefined in updates object");
        
        // Récupérer le client actuel depuis le cache pour trouver une valeur à utiliser
        const cachedClient = queryClient.getQueryData<Client[]>(["clients"])?.find(client => client.id === id);
        
        if (cachedClient?.regimefiscal) {
          updates.regimefiscal = cachedClient.regimefiscal;
          console.log("Using cached regimefiscal value:", updates.regimefiscal);
        } else {
          // Valeur par défaut basée sur le type de client
          updates.regimefiscal = updates.type === "physique" ? "igs" : "non_lucratif";
          console.log("Applied fallback regimefiscal value:", updates.regimefiscal);
        }
      }
      
      try {
        // Appel au service avec journalisation complète
        console.log("Calling updateClient with regimefiscal:", updates.regimefiscal);
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
      
      // Vérification après mise à jour
      console.log("Updated client data in mutation:", data);
      console.log("Regime fiscal after update:", data.regimefiscal);
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
