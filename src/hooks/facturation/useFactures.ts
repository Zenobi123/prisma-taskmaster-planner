
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
  const { factures, setFactures, allClients } = useFacturesList(toast);
  
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
    setDateFilter,
    filteredFactures
  } = useFactureFilters(factures);
  
  // Sorting states and handlers
  const { 
    sortKey, 
    setSortKey,
    sortDirection, 
    setSortDirection
  } = useFactureSorting();
  
  // Facture actions (view, download, edit, delete, send, cancel)
  const { 
    handleVoirFacture, 
    handleTelechargerFacture,
    addFacture,
    updateFacture,
    deleteFacture,
    sendFacture,
    cancelFacture
  } = useFactureActions(toast, factures, setFactures);
  
  // Edit dialog state and handlers
  const {
    editFactureDialogOpen,
    setEditFactureDialogOpen,
    currentEditFacture,
    setCurrentEditFacture,
    handleEditFacture
  } = useFactureDialog();
  
  // Apply sorting to filtered factures
  const sortedFactures = useMemo(() => {
    const sorted = [...filteredFactures].sort((a, b) => {
      const getValue = (item: Facture, key: string) => {
        switch (key) {
          case 'date':
          case 'echeance':
            return new Date(item[key as keyof Facture] as string).getTime();
          case 'client':
            return item.client?.nom || '';
          case 'montant':
            return item.montant;
          default:
            return String(item[key as keyof Facture] || '');
        }
      };

      const aValue = getValue(a, sortKey);
      const bValue = getValue(b, sortKey);

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredFactures, sortKey, sortDirection]);
  
  // Pagination
  const { 
    currentPage, 
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedFactures
  } = useFacturePagination(sortedFactures);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter]);

  return {
    searchTerm,
    setSearchTerm,
    factures,
    paginatedFactures,
    filteredAndSortedFactures: sortedFactures,
    allClients,
    handleVoirFacture,
    handleTelechargerFacture,
    handleEditFacture,
    addFacture,
    updateFacture,
    deleteFacture,
    sendFacture,
    cancelFacture,
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

export { useFactures as default };
