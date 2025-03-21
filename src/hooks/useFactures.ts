
import { useState, useMemo, useEffect } from "react";
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { generatePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getFactures, 
  formatClientsForSelector, 
  addFactureToDatabase 
} from "@/services/factureService";
import {
  applySearchFilter,
  applyStatusFilter,
  applyClientFilter,
  applyDateFilter,
  sortFactures,
  getPaginatedFactures,
  calculateTotalPages
} from "@/utils/factureUtils";

export const useFactures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [factures, setFactures] = useState<Facture[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const { toast } = useToast();
  
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
  
  // Fetch factures and clients from Supabase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturesData = await getFactures();
        setFactures(facturesData);
        
        // We need to fetch clients separately for the selector
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("*");
          
        if (clientsError) {
          console.error("Error fetching clients:", clientsError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les clients.",
          });
          return;
        }
        
        const formattedClients = formatClientsForSelector(clientsData);
        setAllClients(formattedClients);
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur s'est produite lors de la récupération des données.",
        });
      }
    };
    
    fetchData();
  }, [toast]); // Re-fetch when toast changes (should be stable, so effectively once on mount)

  // Apply filters and sort
  const filteredAndSortedFactures = useMemo(() => {
    let result = applySearchFilter(factures, searchTerm);
    result = applyStatusFilter(result, statusFilter);
    result = applyClientFilter(result, clientFilter);
    result = applyDateFilter(result, dateFilter);
    result = sortFactures(result, sortKey, sortDirection);
    
    return result;
  }, [factures, searchTerm, statusFilter, clientFilter, dateFilter, sortKey, sortDirection]);

  // Get paginated results
  const paginatedFactures = useMemo(() => {
    return getPaginatedFactures(filteredAndSortedFactures, currentPage, itemsPerPage);
  }, [filteredAndSortedFactures, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return calculateTotalPages(filteredAndSortedFactures.length, itemsPerPage);
  }, [filteredAndSortedFactures, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, dateFilter]);

  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  const addFacture = async (facture: Facture) => {
    try {
      // Save to database
      await addFactureToDatabase(facture);
      
      // Add the facture to the local state
      setFactures(prevFactures => [facture, ...prevFactures]);
      
      toast({
        title: "Succès",
        description: "Facture enregistrée avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in addFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de la facture.",
      });
      return false;
    }
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
