
import { useState, useMemo } from "react";
import { Facture } from "@/types/facture";
import { useFactureActions } from "./useFactureActions";
import { useFactureFilters } from "./useFactureFilters";
import { clientsExemple, facturesExemple } from "@/data/facturesExemple";
import { 
  filterFacturesBySearchTerm,
  filterFacturesByStatus,
  filterFacturesByClient,
  filterFacturesByDate,
  filterFacturesByPeriode,
  filterFacturesByMontant,
  filterFacturesByModePaiement,
  sortFactures,
  paginateFactures,
  calculateTotalPages 
} from "@/utils/factureUtils";

export const useFactures = () => {
  // Initialize states
  const [factures, setFactures] = useState<Facture[]>(facturesExemple);
  const [allClients] = useState(clientsExemple);
  
  // Get facture actions
  const { 
    handleVoirFacture, 
    handleTelechargerFacture,
    handleModifierFacture,
    handleAnnulerFacture, 
    addFacture 
  } = useFactureActions();
  
  // Get facture filters
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
    periodeFilter,
    setPeriodeFilter,
    montantFilter,
    setMontantFilter,
    modePaiementFilter,
    setModePaiementFilter,
    resetFilters,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage
  } = useFactureFilters();

  // Apply all filters and sort
  const filteredAndSortedFactures = useMemo(() => {
    // Apply all filters
    let result = filterFacturesBySearchTerm(factures, searchTerm);
    result = filterFacturesByStatus(result, statusFilter);
    result = filterFacturesByClient(result, clientFilter);
    result = filterFacturesByDate(result, dateFilter);
    
    // Appliquer les nouveaux filtres
    result = filterFacturesByPeriode(result, periodeFilter.debut, periodeFilter.fin);
    result = filterFacturesByMontant(result, montantFilter.min, montantFilter.max);
    result = filterFacturesByModePaiement(result, modePaiementFilter);
    
    // Apply sorting
    result = sortFactures(result, sortKey, sortDirection);
    
    return result;
  }, [
    factures, searchTerm, statusFilter, clientFilter, dateFilter, 
    periodeFilter, montantFilter, modePaiementFilter, 
    sortKey, sortDirection
  ]);

  // Get paginated results
  const paginatedFactures = useMemo(() => {
    return paginateFactures(filteredAndSortedFactures, currentPage, itemsPerPage);
  }, [filteredAndSortedFactures, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return calculateTotalPages(filteredAndSortedFactures.length, itemsPerPage);
  }, [filteredAndSortedFactures, itemsPerPage]);

  // Add a new facture to the list
  const addNewFacture = (facture: Facture) => {
    setFactures(prevFactures => addFacture(prevFactures, facture));
  };
  
  const clearFilters = () => {
    resetFilters();
  };

  return {
    searchTerm,
    setSearchTerm,
    factures,
    setFactures,
    paginatedFactures,
    filteredAndSortedFactures,
    allClients,
    handleVoirFacture,
    handleTelechargerFacture,
    handleModifierFacture,
    handleAnnulerFacture,
    addFacture: addNewFacture,
    // Filters
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
    periodeFilter,
    setPeriodeFilter,
    montantFilter,
    setMontantFilter,
    modePaiementFilter,
    setModePaiementFilter,
    clearFilters,
    // Sorting
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
