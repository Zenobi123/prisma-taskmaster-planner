
import { Facture } from "@/types/facture";

// Filter factures by search term
export const filterFacturesBySearchTerm = (factures: Facture[], searchTerm: string): Facture[] => {
  if (!factures || !Array.isArray(factures)) return [];
  if (!searchTerm) return factures;
  
  return factures.filter(facture => 
    facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Filter factures by status
export const filterFacturesByStatus = (factures: Facture[], statusFilter: string | null): Facture[] => {
  if (!factures || !Array.isArray(factures)) return [];
  if (!statusFilter) return factures;
  
  return factures.filter(facture => facture.status === statusFilter);
};

// Filter factures by client
export const filterFacturesByClient = (factures: Facture[], clientFilter: string | null): Facture[] => {
  if (!factures || !Array.isArray(factures)) return [];
  if (!clientFilter) return factures;
  
  return factures.filter(facture => facture.client_id === clientFilter);
};

// Filter factures by date
export const filterFacturesByDate = (factures: Facture[], dateFilter: Date | null): Facture[] => {
  if (!factures || !Array.isArray(factures)) return [];
  if (!dateFilter) return factures;
  
  const dateFormatted = dateFilter.toLocaleDateString('fr-FR');
  return factures.filter(facture => facture.date === dateFormatted);
};

// Sort factures by key and direction
export const sortFactures = (
  factures: Facture[], 
  sortKey: string, 
  sortDirection: "asc" | "desc"
): Facture[] => {
  if (!factures || !Array.isArray(factures)) return [];
  
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

// Paginate factures
export const paginateFactures = (
  factures: Facture[], 
  currentPage: number, 
  itemsPerPage: number
): Facture[] => {
  if (!factures || !Array.isArray(factures)) return [];
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return factures.slice(startIndex, endIndex);
};

// Calculate total pages
export const calculateTotalPages = (
  totalItems: number, 
  itemsPerPage: number
): number => {
  return Math.ceil(totalItems / itemsPerPage);
};
