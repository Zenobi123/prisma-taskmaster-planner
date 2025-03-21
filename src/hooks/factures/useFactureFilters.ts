
import { useMemo } from "react";
import { Facture } from "@/types/facture";

interface UseFactureFiltersProps {
  factures: Facture[];
  searchTerm: string;
  statusFilter: string | null;
  clientFilter: string | null;
  dateFilter: Date | null;
  sortKey: string;
  sortDirection: "asc" | "desc";
}

export const useFactureFilters = ({
  factures,
  searchTerm,
  statusFilter,
  clientFilter,
  dateFilter,
  sortKey,
  sortDirection
}: UseFactureFiltersProps) => {
  
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

  return { filteredAndSortedFactures };
};
