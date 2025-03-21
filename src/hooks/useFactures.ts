
import { useState, useEffect } from "react";
import { Facture } from "@/types/facture";
import { clientsExemple } from "@/services/clientService.mock";
import { useFactureFilters } from "./factures/useFactureFilters";
import { useFacturePagination } from "./factures/useFacturePagination";
import { useFactureActions } from "./factures/useFactureActions";
import { supabase } from "@/integrations/supabase/client";

export const useFactures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [factures, setFactures] = useState<Facture[]>([]);
  const [allClients] = useState(clientsExemple);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  
  // Sort states
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Use the filtering hook
  const { filteredAndSortedFactures } = useFactureFilters({
    factures,
    searchTerm,
    statusFilter,
    clientFilter,
    dateFilter,
    sortKey,
    sortDirection
  });

  // Use the pagination hook
  const { paginatedFactures, totalPages } = useFacturePagination({
    factures: filteredAndSortedFactures,
    currentPage,
    itemsPerPage
  });

  // Use the actions hook
  const { handleVoirFacture, handleTelechargerFacture } = useFactureActions();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, dateFilter]);

  const addFacture = (facture: Facture) => {
    setFactures(prevFactures => [facture, ...prevFactures]);
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
    addFacture,
    // Filters
    statusFilter,
    setStatusFilter,
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
  };
};
