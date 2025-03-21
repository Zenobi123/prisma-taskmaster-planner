
import { Facture } from "@/types/facture";

// Apply search term filter
export const applySearchFilter = (factures: Facture[], searchTerm: string): Facture[] => {
  if (!searchTerm) return factures;
  
  return factures.filter(facture => 
    facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Apply status filter
export const applyStatusFilter = (factures: Facture[], statusFilter: string | null): Facture[] => {
  if (!statusFilter) return factures;
  
  return factures.filter(facture => facture.status === statusFilter);
};

// Apply client filter
export const applyClientFilter = (factures: Facture[], clientFilter: string | null): Facture[] => {
  if (!clientFilter) return factures;
  
  return factures.filter(facture => facture.client_id === clientFilter);
};

// Apply date filter
export const applyDateFilter = (factures: Facture[], dateFilter: Date | null): Facture[] => {
  if (!dateFilter) return factures;
  
  const dateFormatted = dateFilter.toLocaleDateString('fr-FR');
  return factures.filter(facture => facture.date === dateFormatted);
};

// Sort factures by key
export const sortFactures = (
  factures: Facture[], 
  sortKey: string, 
  sortDirection: "asc" | "desc"
): Facture[] => {
  return [...factures].sort((a, b) => {
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
};

// Get a paginated subset of factures
export const getPaginatedFactures = (
  factures: Facture[], 
  currentPage: number, 
  itemsPerPage: number
): Facture[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return factures.slice(startIndex, endIndex);
};

// Calculate total pages
export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};
