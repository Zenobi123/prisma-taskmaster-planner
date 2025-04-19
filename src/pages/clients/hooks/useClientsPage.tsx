
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { useClientMutations } from "./useClientMutations";
import { useClientFilters } from "./useClientFilters";
import { useClientDialogs } from "./useClientDialogs";
import { useState, useCallback, useEffect } from "react";

export function useClientsPage() {
  const { toast } = useToast();
  const [isDataReady, setIsDataReady] = useState(false);

  // Use lower staleTime to prevent stale data, but with proper cacheTime
  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      // Mark data as ready to prevent UI freezing from premature renders
      setIsDataReady(true);
    }
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
  } = useClientFilters(isDataReady ? clients : []);

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

  // Debounced refetch to prevent excessive API calls
  const debouncedRefetch = useCallback(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        refetch();
      }, 500);
    };
  }, [refetch]);

  // Reset data ready state when loading begins
  useEffect(() => {
    if (isLoading) {
      setIsDataReady(false);
    }
  }, [isLoading]);

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
    isDataReady,
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
    toast,
    refreshClients: debouncedRefetch
  };
}
