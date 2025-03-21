
import { useState, useEffect } from "react";

export const useFactureFilters = () => {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  // Nouveaux filtres
  const [periodeFilter, setPeriodeFilter] = useState<{
    debut: Date | null;
    fin: Date | null;
  }>({ debut: null, fin: null });
  const [montantFilter, setMontantFilter] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [modePaiementFilter, setModePaiementFilter] = useState<string | null>(null);
  
  // Sort states
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, dateFilter, periodeFilter, montantFilter, modePaiementFilter]);

  const resetFilters = () => {
    setStatusFilter(null);
    setClientFilter(null);
    setDateFilter(null);
    setPeriodeFilter({ debut: null, fin: null });
    setMontantFilter({ min: null, max: null });
    setModePaiementFilter(null);
  };

  return {
    // Search
    searchTerm,
    setSearchTerm,
    
    // Filters
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
    // Nouveaux filtres
    periodeFilter,
    setPeriodeFilter,
    montantFilter,
    setMontantFilter,
    modePaiementFilter,
    setModePaiementFilter,
    resetFilters,
    
    // Sorting
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage
  };
};
