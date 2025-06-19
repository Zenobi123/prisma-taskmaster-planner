
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Facture } from "@/types/facture";
import { getFactures } from "@/services/factureService";
import { useFactureActions } from "./useFactureActions";
import { useToast } from "@/hooks/use-toast";
import { 
  applySearchFilter, 
  applyStatusFilter, 
  applyClientFilter, 
  applyDateFilter,
  sortFactures,
  getPaginatedFactures,
  calculateTotalPages
} from "@/utils/factureUtils";

const ITEMS_PER_PAGE = 10;

export const useFactures = () => {
  const { toast } = useToast();
  const [factures, setFactures] = useState<Facture[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusPaiementFilter, setStatusPaiementFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortKey, setSortKey] = useState("date");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>("desc");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [editFactureDialogOpen, setEditFactureDialogOpen] = useState(false);
  const [currentEditFacture, setCurrentEditFacture] = useState<Facture | null>(null);

  // Fetch data
  const { data: facturesData = [], isLoading } = useQuery({
    queryKey: ["factures"],
    queryFn: getFactures,
  });

  const { data: allClients = [] } = useQuery({
    queryKey: ["clients-for-factures"],
    queryFn: async () => {
      const { getClients } = await import("@/services/clientService");
      return getClients();
    },
  });

  // Update local state when data changes
  useEffect(() => {
    setFactures(facturesData);
  }, [facturesData]);

  // Filter and sort factures
  const filteredFactures = useMemo(() => {
    let filtered = [...factures];
    
    // Apply filters
    filtered = applySearchFilter(filtered, searchTerm);
    filtered = applyStatusFilter(filtered, statusFilter);
    filtered = applyClientFilter(filtered, clientFilter);
    
    // Apply date filter
    if (dateFilter) {
      filtered = applyDateFilter(filtered, dateFilter.toISOString().split('T')[0]);
    }
    
    // Apply status payment filter
    if (statusPaiementFilter !== "all") {
      filtered = filtered.filter(facture => facture.status_paiement === statusPaiementFilter);
    }
    
    // Sort
    filtered = sortFactures(filtered, sortKey, sortDirection);
    
    return filtered;
  }, [factures, searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter, sortKey, sortDirection]);

  // Pagination
  const totalPages = calculateTotalPages(filteredFactures.length, ITEMS_PER_PAGE);
  const paginatedFactures = getPaginatedFactures(filteredFactures, currentPage, ITEMS_PER_PAGE);

  // Actions
  const factureActions = useFactureActions(toast, factures, setFactures);

  const handleEditFacture = (facture: Facture) => {
    setCurrentEditFacture(facture);
    setEditFactureDialogOpen(true);
  };

  return {
    // Data
    factures: paginatedFactures,
    paginatedFactures,
    allClients,
    isLoading,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusPaiementFilter,
    setStatusPaiementFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter: (date: Date | undefined) => setDateFilter(date),
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    
    // Actions
    ...factureActions,
    handleEditFacture,
    
    // Dialog states
    editFactureDialogOpen,
    setEditFactureDialogOpen,
    currentEditFacture,
    setCurrentEditFacture,
  };
};
