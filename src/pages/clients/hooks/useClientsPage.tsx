
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { useClientMutations } from "./useClientMutations";
import { useClientFilters } from "./useClientFilters";
import { useClientDialogs } from "./useClientDialogs";

export function useClientsPage() {
  const { toast } = useToast();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
    retry: 2
  });

  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    filteredClients
  } = useClientFilters(clients);

  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    newClientType,
    setNewClientType,
    selectedClient,
    setSelectedClient
  } = useClientDialogs();

  const {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation
  } = useClientMutations();

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
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
    clients: filteredClients,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    isDialogOpen,
    setIsDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    newClientType,
    setNewClientType,
    selectedClient,
    addMutation,
    updateMutation,
    handleView,
    handleEdit,
    handleArchive,
    handleRestore,
    handleDelete,
    toast
  };
}
