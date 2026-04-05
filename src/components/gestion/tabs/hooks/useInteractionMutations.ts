import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { Client, Interaction } from "@/types/client";

export function useInteractionMutations(clientId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addInteraction = useMutation({
    mutationFn: async (newInteraction: Interaction) => {
      // First get current client to append the interaction
      const clients = queryClient.getQueryData<Client[]>(["clients"]) || [];
      const currentClient = clients.find(c => c.id === clientId);

      if (!currentClient) {
        throw new Error("Client non trouvé");
      }

      const interactions = currentClient.interactions || [];
      const updatedInteractions = [...interactions, newInteraction];

      return await updateClient(clientId, { interactions: updatedInteractions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Interaction ajoutée",
        description: "La nouvelle interaction a été enregistrée avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout de l'interaction:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'interaction.",
        variant: "destructive",
      });
    },
  });

  return { addInteraction };
}
