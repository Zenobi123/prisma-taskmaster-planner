
import { useState, useMemo, useEffect } from "react";
import { Facture } from "@/types/facture";
import { useToast } from "@/components/ui/use-toast";
import { useFacturesList } from "./useFacturesList";
import { useFactureFilters } from "./useFactureFilters";
import { useFactureSorting } from "./useFactureSorting";
import { useFacturePagination } from "./useFacturePagination";
import { useFactureActions } from "./useFactureActions";
import { useFactureDialog } from "./useFactureDialog";

export const useFactures = () => {
  const { toast } = useToast();
  
  // Get factures data and clients
  const { factures, allClients } = useFacturesList(toast);
  
  // Filter states and handlers
  const { 
    searchTerm, 
    setSearchTerm,
    statusFilter, 
    setStatusFilter,
    statusPaiementFilter, 
    setStatusPaiementFilter,
    clientFilter, 
    setClientFilter,
    dateFilter, 
    setDateFilter
  } = useFactureFilters();
  
  // Sorting states and handlers
  const { 
    sortKey, 
    setSortKey,
    sortDirection, 
    setSortDirection
  } = useFactureSorting();
  
  // Facture actions (view, download, edit, delete)
  const { 
    handleVoirFacture, 
    handleTelechargerFacture,
    addFacture,
    updateFacture,
    deleteFacture
  } = useFactureActions(toast, factures, setFactures);
  
  // Edit dialog state and handlers
  const {
    editFactureDialogOpen,
    setEditFactureDialogOpen,
    currentEditFacture,
    setCurrentEditFacture,
    handleEditFacture
  } = useFactureDialog();
  
  // State for storing filtered and sorted factures
  const [filteredFactures, setFilteredFactures] = useState<Facture[]>([]);
  
  // Apply filters and sorting
  useEffect(() => {
    const filtered = useFactureFilters.applyFilters(
      factures,
      searchTerm,
      statusFilter,
      statusPaiementFilter,
      clientFilter,
      dateFilter
    );
    
    const sorted = useFactureSorting.sortFactures(filtered, sortKey, sortDirection);
    setFilteredFactures(sorted);
  }, [factures, searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter, sortKey, sortDirection]);
  
  // Pagination
  const { 
    currentPage, 
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedFactures
  } = useFacturePagination(filteredFactures);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter]);

  return {
    searchTerm,
    setSearchTerm,
    factures,
    paginatedFactures,
    filteredAndSortedFactures: filteredFactures,
    allClients,
    handleVoirFacture,
    handleTelechargerFacture,
    handleEditFacture,
    addFacture,
    updateFacture,
    deleteFacture,
    // Filters
    statusFilter,
    setStatusFilter,
    statusPaiementFilter,
    setStatusPaiementFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
    // Sorting
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    // Edit dialog state
    editFactureDialogOpen,
    setEditFactureDialogOpen,
    currentEditFacture,
    setCurrentEditFacture
  };
};

// Re-export for backward compatibility
export { useFactures as default };
