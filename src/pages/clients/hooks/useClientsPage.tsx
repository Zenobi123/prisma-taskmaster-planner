
import { Client } from "@/types/client";
import { useClientsPageState } from "./useClientsPageState";
import { useClientsPageData, ClientFilters } from "./useClientsPageData";
import { useClientsPageMutations } from "./useClientsPageMutations";
import { useClientsPageActions } from "./useClientsPageActions";
import { useConfirmation } from "./confirmation/ConfirmationDialogContext";

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
    setSelectedClient,
    createdAfterDate,
    setCreatedAfterDate,
    createdBeforeDate, 
    setCreatedBeforeDate,
    isAdvancedFiltersOpen,
    setIsAdvancedFiltersOpen
  } = useClientsPageState();

  // Get data and filtering
  const { 
    clients, 
    isLoading, 
    error, 
    filterClients, 
    refreshClients,
    getAvailableSectors 
  } = useClientsPageData();

  // Get mutations
  const {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation,
    toast,
    showConfirmation
  } = useClientsPageMutations();
  
  // Get confirmation dialog
  const { confirmationDialog } = useConfirmation();

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

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedSecteur("all");
    setShowArchived(false);
    setCreatedAfterDate(null);
    setCreatedBeforeDate(null);
  };

  // Filter clients based on current filter state
  const filterConfig: ClientFilters = {
    searchTerm,
    type: selectedType,
    secteur: selectedSecteur,
    showArchived,
    createdAfter: createdAfterDate,
    createdBefore: createdBeforeDate
  };

  const filteredClients = filterClients(clients, filterConfig);
  const availableSectors = getAvailableSectors();

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
    createdAfterDate,
    setCreatedAfterDate,
    createdBeforeDate,
    setCreatedBeforeDate,
    isAdvancedFiltersOpen,
    setIsAdvancedFiltersOpen,
    resetFilters,
    refreshClients,
    availableSectors,
    addMutation,
    updateMutation,
    handleView,
    handleEdit,
    handleArchive,
    handleRestore,
    handleDelete,
    toast,
    confirmationDialog
  };
}
