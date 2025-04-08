
import { Client } from "@/types/client";
import { useClientsPageMutations } from "./useClientsPageMutations";

export function useClientsPageActions() {
  const {
    updateMutation,
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
    if (window.confirm("Êtes-vous sûr de vouloir archiver ce client ?")) {
      try {
        await archiveMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de l'archivage:", error);
      }
    }
  };

  const handleRestore = async (client: Client) => {
    if (window.confirm("Êtes-vous sûr de vouloir restaurer ce client ?")) {
      try {
        await restoreMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de la restauration:", error);
      }
    }
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce client ? Cette action est irréversible.")) {
      try {
        await deleteMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
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
