
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { useClientMutations } from "./useClientMutations";
import { useClientFilters } from "./useClientFilters";
import { useClientDialogs } from "./useClientDialogs";
import { useState, useCallback, useEffect, useRef } from "react";
import { ConfirmVariant } from "@/components/ui/confirm-dialog";

export function useClientsPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTrash, setShowTrash] = useState(false);
  const hasLoadedOnce = useRef(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    variant: ConfirmVariant;
    onConfirm: () => void;
    isLoading: boolean;
  }>({
    open: false,
    title: "",
    description: "",
    confirmLabel: "",
    variant: "danger",
    onConfirm: () => {},
    isLoading: false,
  });

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, open: false, isLoading: false }));
  }, []);

  const {
    data: clients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
    staleTime: 30000,
    gcTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  if (clients.length > 0) {
    hasLoadedOnce.current = true;
  }

  const isDataReady = hasLoadedOnce.current || clients.length > 0;

  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    selectedRegimeFiscal,
    setSelectedRegimeFiscal,
    selectedCDI,
    setSelectedCDI,
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
    deleteMutation,
    importMutation
  } = useClientMutations();

  // Handle URL parameter for editing client
  useEffect(() => {
    const editClientId = searchParams.get('edit');
    if (editClientId && clients.length > 0) {
      const clientToEdit = clients.find(client => client.id === editClientId);
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
  }, [searchParams, clients, setSelectedClient, setIsEditDialogOpen, setSearchParams]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedRefetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      refetch();
    }, 500);
  }, [refetch]);

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const handleArchive = (client: Client) => {
    setConfirmDialog({
      open: true,
      title: "Archiver ce client ?",
      description: `Le client "${client.type === "physique" ? client.nom : client.raisonsociale}" sera archivé. Vous pourrez le restaurer ultérieurement.`,
      confirmLabel: "Archiver",
      variant: "warning",
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
          await archiveMutation.mutateAsync(client.id);
        } catch (error) {
          console.error('Error archiving client:', error);
        } finally {
          closeConfirmDialog();
        }
      },
    });
  };

  const handleRestore = (client: Client) => {
    setConfirmDialog({
      open: true,
      title: "Restaurer ce client ?",
      description: `Le client "${client.type === "physique" ? client.nom : client.raisonsociale}" sera restauré et redeviendra actif.`,
      confirmLabel: "Restaurer",
      variant: "info",
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
          await restoreMutation.mutateAsync(client.id);
        } catch (error) {
          console.error('Error restoring client:', error);
        } finally {
          closeConfirmDialog();
        }
      },
    });
  };

  const handleDelete = (client: Client) => {
    setConfirmDialog({
      open: true,
      title: "Supprimer ce client ?",
      description: `Le client "${client.type === "physique" ? client.nom : client.raisonsociale}" sera envoyé à la corbeille. Vous pourrez le restaurer depuis la corbeille.`,
      confirmLabel: "Supprimer",
      variant: "danger",
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
          await deleteMutation.mutateAsync(client.id);
        } catch (error) {
          console.error('Error deleting client:', error);
        } finally {
          closeConfirmDialog();
        }
      },
    });
  };

  const handleImportClients = (clientsToImport: Partial<Client>[]) => {
    importMutation.mutate(clientsToImport);
  };

  const handleTrashClick = () => {
    setShowTrash(true);
  };

  const handleCloseTrash = () => {
    setShowTrash(false);
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
    selectedRegimeFiscal,
    setSelectedRegimeFiscal,
    selectedCDI,
    setSelectedCDI,
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
    confirmDialog,
    closeConfirmDialog,
    handleView,
    handleEdit,
    handleArchive,
    handleRestore,
    handleDelete,
    handleImportClients,
    handleTrashClick,
    handleCloseTrash,
    toast,
    refreshClients: debouncedRefetch
  };
}
