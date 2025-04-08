
import { Client } from "@/types/client";
import { useClientsPageMutations } from "./useClientsPageMutations";

export function useClientsPageActions() {
  const {
    archiveMutation,
    restoreMutation,
    deleteMutation
  } = useClientsPageMutations();

  const handleView = (client: Client) => {
    return client;
  };

  const handleEdit = (client: Client) => {
    return client;
  };

  const handleArchive = async (client: Client) => {
    try {
      await archiveMutation.mutateAsync(client.id);
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
      // Error already handled by mutation
    }
  };

  const handleRestore = async (client: Client) => {
    try {
      await restoreMutation.mutateAsync(client.id);
    } catch (error) {
      console.error("Erreur lors de la restauration:", error);
      // Error already handled by mutation
    }
  };

  const handleDelete = async (client: Client) => {
    try {
      await deleteMutation.mutateAsync(client.id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      // Error already handled by mutation
    }
  };

  return {
    handleView,
    handleEdit,
    handleArchive,
    handleRestore,
    handleDelete
  };
}
