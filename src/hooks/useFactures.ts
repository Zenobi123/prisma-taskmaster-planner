
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

// Données d'exemple pour les factures
const facturesExemple: Facture[] = [
  { 
    id: "F-2023-001", 
    client_id: "client1",
    client: {
      id: "client1",
      nom: "Société ABC",
      adresse: "123 Rue Principale, Douala",
      telephone: "694123456",
      email: "contact@societeabc.com"
    }, 
    date: "15/05/2023",
    echeance: "15/06/2023", 
    montant: 450000, 
    montant_paye: 450000,
    status: "payée",
    mode_paiement: "virement",
    prestations: [
      { description: "Prestation 1", quantite: 1, montant: 250000 },
      { description: "Prestation 2", quantite: 2, montant: 100000 }
    ]
  },
  { 
    id: "F-2023-002", 
    client_id: "client2",
    client: {
      id: "client2",
      nom: "Entreprise XYZ",
      adresse: "456 Avenue Centrale, Yaoundé",
      telephone: "677654321",
      email: "info@xyz.com"
    }, 
    date: "22/05/2023",
    echeance: "22/06/2023", 
    montant: 175000,
    montant_paye: 0, 
    status: "en_attente",
    mode_paiement: "espèces",
    prestations: [
      { description: "Consultation", quantite: 1, montant: 175000 }
    ]
  },
  { 
    id: "F-2023-003", 
    client_id: "client3",
    client: {
      id: "client3",
      nom: "Cabinet DEF",
      adresse: "789 Boulevard Ouest, Bafoussam",
      telephone: "698765432",
      email: "cabinet@def.com"
    }, 
    date: "01/06/2023",
    echeance: "01/07/2023", 
    montant: 325000,
    montant_paye: 150000, 
    status: "partiellement_payée",
    mode_paiement: "orange_money",
    prestations: [
      { description: "Audit comptable", quantite: 1, montant: 325000 }
    ]
  },
  { 
    id: "F-2023-004", 
    client_id: "client4",
    client: {
      id: "client4",
      nom: "M. Dupont",
      adresse: "101 Rue des Jardins, Limbé",
      telephone: "651234567",
      email: "dupont@mail.com"
    }, 
    date: "12/06/2023",
    echeance: "12/07/2023", 
    montant: 85000,
    montant_paye: 0, 
    status: "envoyée",
    mode_paiement: "chèque",
    prestations: [
      { description: "Conseil fiscal", quantite: 1, montant: 85000 }
    ]
  },
  { 
    id: "F-2023-005", 
    client_id: "client2",
    client: {
      id: "client2",
      nom: "Entreprise XYZ",
      adresse: "456 Avenue Centrale, Yaoundé",
      telephone: "677654321",
      email: "info@xyz.com"
    }, 
    date: "05/07/2023",
    echeance: "05/08/2023", 
    montant: 220000,
    montant_paye: 220000, 
    status: "payée",
    mode_paiement: "mtn_mobile_money",
    prestations: [
      { description: "Analyse comptable", quantite: 1, montant: 220000 }
    ]
  },
  { 
    id: "F-2023-006", 
    client_id: "client1",
    client: {
      id: "client1",
      nom: "Société ABC",
      adresse: "123 Rue Principale, Douala",
      telephone: "694123456",
      email: "contact@societeabc.com"
    }, 
    date: "18/07/2023",
    echeance: "18/08/2023", 
    montant: 150000,
    montant_paye: 0, 
    status: "annulée",
    mode_paiement: "virement",
    prestations: [
      { description: "Formation fiscalité", quantite: 1, montant: 150000 }
    ]
  },
  { 
    id: "F-2023-007", 
    client_id: "client3",
    client: {
      id: "client3",
      nom: "Cabinet DEF",
      adresse: "789 Boulevard Ouest, Bafoussam",
      telephone: "698765432",
      email: "cabinet@def.com"
    }, 
    date: "02/08/2023",
    echeance: "02/09/2023", 
    montant: 400000,
    montant_paye: 200000, 
    status: "partiellement_payée",
    mode_paiement: "espèces",
    prestations: [
      { description: "Bilan comptable", quantite: 1, montant: 400000 }
    ]
  },
  { 
    id: "F-2023-008", 
    client_id: "client4",
    client: {
      id: "client4",
      nom: "M. Dupont",
      adresse: "101 Rue des Jardins, Limbé",
      telephone: "651234567",
      email: "dupont@mail.com"
    }, 
    date: "15/08/2023",
    echeance: "15/09/2023", 
    montant: 120000,
    montant_paye: 120000, 
    status: "payée",
    mode_paiement: "orange_money",
    prestations: [
      { description: "Consultation juridique", quantite: 1, montant: 120000 }
    ]
  },
];

export const useFactures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [factures, setFactures] = useState<Facture[]>(facturesExemple);
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
