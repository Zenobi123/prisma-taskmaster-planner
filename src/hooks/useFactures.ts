
import { useState, useMemo, useEffect } from "react";
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { generatePDF } from "@/utils/pdfUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
    const fetchFactures = async () => {
      try {
        const { data: facturesData, error: facturesError } = await supabase
          .from("factures")
          .select("*");
          
        if (facturesError) {
          console.error("Error fetching factures:", facturesError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les factures.",
          });
          return;
        }
        
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
        
        // Fetch prestations for each facture
        const facturesWithDetails = await Promise.all(
          facturesData.map(async (facture) => {
            // Find the client for this facture
            const client = clientsData.find((c) => c.id === facture.client_id);
            
            if (!client) {
              console.error(`Client not found for facture: ${facture.id}`);
              return null;
            }
            
            // Fetch prestations
            const { data: prestationsData, error: prestationsError } = await supabase
              .from("prestations")
              .select("*")
              .eq("facture_id", facture.id);
              
            if (prestationsError) {
              console.error(`Error fetching prestations for facture ${facture.id}:`, prestationsError);
              return null;
            }
            
            // Fetch paiements
            const { data: paiementsData, error: paiementsError } = await supabase
              .from("paiements")
              .select("*")
              .eq("facture_id", facture.id);
              
            if (paiementsError) {
              console.error(`Error fetching paiements for facture ${facture.id}:`, paiementsError);
              return null;
            }
            
            // Format dates
            const formatDate = (dateStr: string) => {
              const date = new Date(dateStr);
              return date.toLocaleDateString('fr-FR');
            };
            
            // Create complete facture object with all related data
            const completeFacture: Facture = {
              id: facture.id,
              client_id: facture.client_id,
              client: {
                id: client.id,
                nom: client.type === "physique" ? client.nom || "" : client.raisonsociale || "",
                adresse: client.adresse?.ville || "",
                telephone: client.contact?.telephone || "",
                email: client.contact?.email || ""
              },
              date: formatDate(facture.date),
              echeance: formatDate(facture.echeance),
              montant: facture.montant,
              montant_paye: facture.montant_paye || 0,
              status: facture.status as any,
              mode_paiement: facture.mode_paiement,
              prestations: prestationsData || [],
              paiements: paiementsData || [],
              notes: facture.notes,
              created_at: facture.created_at,
              updated_at: facture.updated_at,
            };
            
            return completeFacture;
          })
        );
        
        // Filter out any null values (factures that failed to load properly)
        const validFactures = facturesWithDetails.filter(f => f !== null) as Facture[];
        setFactures(validFactures);
        
        // Format clients for the client selector
        const formattedClients = clientsData.map(client => ({
          id: client.id,
          nom: client.type === "physique" ? client.nom || "" : client.raisonsociale || "",
          adresse: client.adresse?.ville || "",
          telephone: client.contact?.telephone || "",
          email: client.contact?.email || ""
        }));
        
        setAllClients(formattedClients);
      } catch (error) {
        console.error("Error in fetchFactures:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur s'est produite lors de la récupération des données.",
        });
      }
    };
    
    fetchFactures();
  }, [toast]); // Re-fetch when toast changes (should be stable, so effectively once on mount)

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

  const addFacture = async (facture: Facture) => {
    try {
      // Add to Supabase database
      const { data: factureData, error: factureError } = await supabase
        .from("factures")
        .insert({
          id: facture.id,
          client_id: facture.client_id,
          date: new Date(facture.date.split('/').reverse().join('-')),
          echeance: new Date(facture.echeance.split('/').reverse().join('-')),
          montant: facture.montant,
          montant_paye: facture.montant_paye || 0,
          status: facture.status,
          notes: facture.notes,
          mode_paiement: facture.mode_paiement
        })
        .select()
        .single();
        
      if (factureError) {
        console.error("Error inserting facture:", factureError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'enregistrer la facture.",
        });
        return;
      }
      
      // Add prestations
      if (facture.prestations && facture.prestations.length > 0) {
        const prestationsToInsert = facture.prestations.map(prestation => ({
          facture_id: facture.id,
          description: prestation.description,
          quantite: prestation.quantite || 1,
          montant: prestation.montant,
          taux: prestation.taux || 0
        }));
        
        const { error: prestationsError } = await supabase
          .from("prestations")
          .insert(prestationsToInsert);
          
        if (prestationsError) {
          console.error("Error inserting prestations:", prestationsError);
          toast({
            variant: "destructive",
            title: "Attention",
            description: "Facture créée, mais problème avec les prestations.",
          });
        }
      }
      
      // Add the facture to the local state (include complete facture object with client info)
      setFactures(prevFactures => [facture, ...prevFactures]);
      
      toast({
        title: "Succès",
        description: "Facture enregistrée avec succès.",
      });
    } catch (error) {
      console.error("Error in addFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de la facture.",
      });
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
