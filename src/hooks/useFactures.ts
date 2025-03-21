
import { useState, useMemo, useEffect } from "react";
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { generatePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getFactures, 
  formatClientsForSelector, 
  addFactureToDatabase,
  deleteFactureFromDatabase,
  updateFactureInDatabase
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
import { useNavigate } from "react-router-dom";

export const useFactures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [factures, setFactures] = useState<Facture[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for edit dialog
  const [editFactureDialogOpen, setEditFactureDialogOpen] = useState(false);
  const [currentEditFacture, setCurrentEditFacture] = useState<Facture | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusPaiementFilter, setStatusPaiementFilter] = useState<string | null>(null);
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
    
    // Apply status_paiement filter
    if (statusPaiementFilter) {
      result = result.filter(facture => facture.status_paiement === statusPaiementFilter);
    }
    
    result = applyClientFilter(result, clientFilter);
    result = applyDateFilter(result, dateFilter);
    result = sortFactures(result, sortKey, sortDirection);
    
    return result;
  }, [factures, searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter, sortKey, sortDirection]);

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
  }, [searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter]);

  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  const handleEditFacture = (facture: Facture) => {
    // Set the current facture to edit and open the dialog
    setCurrentEditFacture(facture);
    setEditFactureDialogOpen(true);
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

  const updateFacture = async (facture: Facture) => {
    try {
      // Update in database
      await updateFactureInDatabase(facture);
      
      // Update the facture in the local state
      setFactures(prevFactures => prevFactures.map(f => f.id === facture.id ? facture : f));
      
      toast({
        title: "Succès",
        description: "Facture mise à jour avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in updateFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de la facture.",
      });
      return false;
    }
  };

  const deleteFacture = async (factureId: string) => {
    try {
      await deleteFactureFromDatabase(factureId);
      
      // Update local state by removing the deleted facture
      setFactures(prevFactures => prevFactures.filter(f => f.id !== factureId));
      
      toast({
        title: "Succès",
        description: "Facture supprimée avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in deleteFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la suppression de la facture.",
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
