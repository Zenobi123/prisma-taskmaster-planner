
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Facture, FactureStatus, Paiement } from "@/types/facture";
import { fetchFactures } from "@/services/facture/facturesQuery";
import { createFacture, CreateFactureData } from "@/services/facture/factureCreate";
import { updateFacture, updateFactureStatus, enregistrerPaiement } from "@/services/facture/factureUpdate";
import { deleteFacture } from "@/services/facture/factureDelete";
import { useToast } from "@/components/ui/use-toast";

interface UseFacturesParams {
  status?: string;
  clientId?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useFactures = (params: UseFacturesParams = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState<UseFacturesParams>(params);

  // Requête pour récupérer les factures
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['factures', queryParams],
    queryFn: () => fetchFactures(queryParams),
  });

  // Mutation pour créer une facture
  const createMutation = useMutation({
    mutationFn: (factureData: CreateFactureData) => createFacture(factureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast({
        title: "Succès",
        description: "La facture a été créée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Échec de la création de la facture: ${error.message}`,
      });
    },
  });

  // Mutation pour mettre à jour une facture
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFacture(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast({
        title: "Succès",
        description: "La facture a été mise à jour avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Échec de la mise à jour de la facture: ${error.message}`,
      });
    },
  });

  // Mutation pour mettre à jour le statut d'une facture
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FactureStatus }) => 
      updateFactureStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast({
        title: "Succès",
        description: "Le statut de la facture a été mis à jour.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Échec de la mise à jour du statut: ${error.message}`,
      });
    },
  });

  // Mutation pour enregistrer un paiement
  const paiementMutation = useMutation({
    mutationFn: ({ id, paiement }: { id: string; paiement: Paiement }) => 
      enregistrerPaiement(id, paiement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Échec de l'enregistrement du paiement: ${error.message}`,
      });
    },
  });

  // Mutation pour supprimer une facture
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFacture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast({
        title: "Succès",
        description: "La facture a été supprimée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Échec de la suppression de la facture: ${error.message}`,
      });
    },
  });

  // Méthodes pour interagir avec les factures
  const handleUpdateParams = useCallback((newParams: Partial<UseFacturesParams>) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const handleCreateInvoice = useCallback((data: CreateFactureData) => {
    return createMutation.mutateAsync(data);
  }, [createMutation]);

  const handleUpdateInvoice = useCallback((id: string, data: any) => {
    return updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const handleUpdateStatus = useCallback((id: string, status: FactureStatus) => {
    return updateStatusMutation.mutateAsync({ id, status });
  }, [updateStatusMutation]);

  const handlePaiementPartiel = useCallback((id: string, paiement: Paiement) => {
    return paiementMutation.mutateAsync({ id, paiement });
  }, [paiementMutation]);

  const handleDeleteInvoice = useCallback((id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const fetchFactures = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['factures'] });
  }, [queryClient]);

  return {
    factures: data?.data || [],
    totalCount: data?.count || 0,
    isLoading,
    isError,
    error,
    params: queryParams,
    updateParams: handleUpdateParams,
    handleCreateInvoice,
    handleUpdateInvoice,
    handleUpdateStatus,
    handlePaiementPartiel,
    handleDeleteInvoice,
    fetchFactures,
  };
};
