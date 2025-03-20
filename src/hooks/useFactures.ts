
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
  sortFactures,
  paginateFactures,
  calculateTotalPages 
} from "@/utils/factureUtils";

export const useFactures = () => {
  // Initialize states
  const [factures, setFactures] = useState<Facture[]>(facturesExemple);
  const [allClients] = useState(clientsExemple);
  
  // Get facture actions
  const { handleVoirFacture, handleTelechargerFacture, addFacture } = useFactureActions();
  
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
    console.log("Applying filters to factures:", factures);
    let result = filterFacturesBySearchTerm(factures, searchTerm);
    result = filterFacturesByStatus(result, statusFilter);
    result = filterFacturesByClient(result, clientFilter);
    result = filterFacturesByDate(result, dateFilter);
    
    // Apply sorting
    result = sortFactures(result, sortKey, sortDirection);
    
    return result;
  }, [factures, searchTerm, statusFilter, clientFilter, dateFilter, sortKey, sortDirection]);

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
    paginatedFactures,
    filteredAndSortedFactures,
    allClients,
    handleVoirFacture,
    handleTelechargerFacture,
    addFacture: addNewFacture,
    // Filters
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
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
