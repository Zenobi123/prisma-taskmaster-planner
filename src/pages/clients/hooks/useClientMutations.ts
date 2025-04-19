
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { addClient, archiveClient, updateClient, deleteClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useClientMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client ajouté",
        description: "Le nouveau client a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du client.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      console.log("Mise à jour du client:", { id, updates });
      return await updateClient(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client archivé",
        description: "Le client a été archivé avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'archivage du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'archivage du client.",
        variant: "destructive",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Restauration du client:", id);
      return await updateClient(id, { statut: "actif" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client restauré",
        description: "Le client a été restauré avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la restauration du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la restauration du client.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été définitivement supprimé.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });

  return {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation,
  };
}
