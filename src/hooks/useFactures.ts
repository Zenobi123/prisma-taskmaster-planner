
import { useState } from 'react';
import { Facture } from '@/types/facture';
import { useFacturesFetch, FacturesFilters } from './factures/useFacturesFetch';
import { useFactureOperations } from './factures/useFactureOperations';
import { useFacturePaiement } from './factures/useFacturePaiement';

export const useFactures = (initialFilters?: FacturesFilters) => {
  const {
    factures,
    isLoading: isFetchLoading,
    totalCount,
    filters,
    fetchFactures,
    updateFilters
  } = useFacturesFetch(initialFilters);

  const {
    selectedFacture,
    isLoading: isOperationsLoading,
    createFacture,
    updateFacture,
    deleteFacture,
    fetchFactureById,
    setSelectedFacture
  } = useFactureOperations(fetchFactures);

  const {
    isLoading: isPaiementLoading,
    enregistrerPaiement
  } = useFacturePaiement(fetchFactures);

  // Combine loading states
  const isLoading = isFetchLoading || isOperationsLoading || isPaiementLoading;

  return {
    factures,
    selectedFacture,
    isLoading,
    totalCount,
    filters,
    fetchFactures,
    createFacture,
    updateFacture,
    deleteFacture,
    fetchFactureById,
    setSelectedFacture,
    updateFilters,
    enregistrerPaiement
  };
};
