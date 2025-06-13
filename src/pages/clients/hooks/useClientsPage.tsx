
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { useClientMutations } from "./useClientMutations";
import { useClientFilters } from "./useClientFilters";
import { useClientDialogs } from "./useClientDialogs";
import { useState, useCallback, useEffect } from "react";

export function useClientsPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDataReady, setIsDataReady] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const { 
    data: allClients = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false), // Only get active clients
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes 
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (allClients.length > 0) {
      setIsDataReady(true);
    }
  }, [allClients]);

  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    filteredClients,
    handleMultiCriteriaChange
  } = useClientFilters(isDataReady ? allClients : []);

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

  // Handle URL parameter for editing client
  useEffect(() => {
    const editClientId = searchParams.get('edit');
    if (editClientId && allClients.length > 0) {
      const clientToEdit = allClients.find(client => client.id === editClientId);
      if (clientToEdit) {
        setSelectedClient(clientToEdit);
        setIsEditDialogOpen(true);
        // Remove the edit parameter from URL
        setSearchParams(params => {
          params.delete('edit');
          return params;
        });
      }
    }
  }, [searchParams, allClients, setSelectedClient, setIsEditDialogOpen, setSearchParams]);

  const debouncedRefetch = useCallback(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        refetch();
      }, 500);
    };
  }, [refetch]);

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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ? Il sera envoyé à la corbeille.")) {
      try {
        await deleteMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleTrashClick = () => {
    setShowTrash(true);
  };

  const handleCloseTrash = () => {
    setShowTrash(false);
  };

  return {
    clients: filteredClients,
    allClients,
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
    showTrash,
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
    handleTrashClick,
    handleCloseTrash,
    handleMultiCriteriaChange,
    toast,
    refreshClients: debouncedRefetch
  };
}
