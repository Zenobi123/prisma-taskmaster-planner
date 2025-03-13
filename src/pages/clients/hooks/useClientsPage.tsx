
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { useClientFilters } from "./useClientFilters";
import { useClientDialogs } from "./useClientDialogs";
import { useClientActions } from "./useClientActions";
import { useClientMutations } from "./mutations/useClientMutations";

export function useClientsPage() {
  const { toast } = useToast();

  // Fetch clients data
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
    retry: 2
  });

  // Use smaller, focused hooks
  const { 
    searchTerm, setSearchTerm,
    selectedType, setSelectedType,
    selectedSecteur, setSelectedSecteur,
    showArchived, setShowArchived,
    filteredClients
  } = useClientFilters(clients);

  const {
    isDialogOpen, setIsDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isViewDialogOpen, setIsViewDialogOpen,
    newClientType, setNewClientType,
    selectedClient, setSelectedClient,
    handleView, handleEdit
  } = useClientDialogs();

  const { handleArchive, handleRestore, handleDelete } = useClientActions();

  const { addMutation, updateMutation } = useClientMutations();

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
