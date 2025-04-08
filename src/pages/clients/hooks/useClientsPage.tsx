
import { Client } from "@/types/client";
import { useClientsPageState } from "./useClientsPageState";
import { useClientsPageData } from "./useClientsPageData";
import { useClientsPageMutations } from "./useClientsPageMutations";
import { useClientsPageActions } from "./useClientsPageActions";

export function useClientsPage() {
  // Get state management
  const {
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
    setSelectedClient
  } = useClientsPageState();

  // Get data and filtering
  const { clients, isLoading, error, filterClients } = useClientsPageData();

  // Get mutations
  const {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation,
    toast
  } = useClientsPageMutations();

  // Get action handlers
  const { handleArchive, handleRestore, handleDelete } = useClientsPageActions();

  // Custom view and edit handlers that update state
  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  // Filter clients based on current filter state
  const filteredClients = filterClients(
    clients,
    searchTerm,
    selectedType,
    selectedSecteur,
    showArchived
  );

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
    setSelectedClient,
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
