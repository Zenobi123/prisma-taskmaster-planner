
import { useState, useEffect } from "react";

export const useFactureFilters = () => {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, dateFilter]);

  const resetFilters = () => {
    setStatusFilter(null);
    setClientFilter(null);
    setDateFilter(null);
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
