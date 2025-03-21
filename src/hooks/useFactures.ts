
import { useState, useMemo, useEffect } from "react";
import { Facture, Client } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";
import { supabase } from "@/integrations/supabase/client";

// Données d'exemple pour les clients
const clientsExemple: Client[] = [
  {
    id: "client1",
    nom: "Société ABC",
    adresse: "123 Rue Principale, Douala",
    telephone: "694123456",
    email: "contact@societeabc.com"
  },
  {
    id: "client2",
    nom: "Entreprise XYZ",
    adresse: "456 Avenue Centrale, Yaoundé",
    telephone: "677654321",
    email: "info@xyz.com"
  },
  {
    id: "client3",
    nom: "Cabinet DEF",
    adresse: "789 Boulevard Ouest, Bafoussam",
    telephone: "698765432",
    email: "cabinet@def.com"
  },
  {
    id: "client4",
    nom: "M. Dupont",
    adresse: "101 Rue des Jardins, Limbé",
    telephone: "651234567",
    email: "dupont@mail.com"
  },
];

export const useFactures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [factures, setFactures] = useState<Facture[]>([]);
  const [allClients] = useState<Client[]>(clientsExemple);
  
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

  // Apply filters and sort
  const filteredAndSortedFactures = useMemo(() => {
    // First apply search term filter
    let result = factures.filter(facture => 
      facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(facture => facture.status === statusFilter);
    }
    
    // Apply client filter
    if (clientFilter) {
      result = result.filter(facture => facture.client_id === clientFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const dateFormatted = dateFilter.toLocaleDateString('fr-FR');
      result = result.filter(facture => {
        return facture.date === dateFormatted;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortKey === 'date') {
        // Convert date string (DD/MM/YYYY) to Date object for comparison
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }
      
      if (sortKey === 'montant') {
        return sortDirection === 'asc' 
          ? a.montant - b.montant 
          : b.montant - a.montant;
      }
      
      return 0;
    });
    
    return result;
  }, [factures, searchTerm, statusFilter, clientFilter, dateFilter, sortKey, sortDirection]);

  // Get paginated results
  const paginatedFactures = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedFactures.slice(startIndex, endIndex);
  }, [filteredAndSortedFactures, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedFactures.length / itemsPerPage);
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
