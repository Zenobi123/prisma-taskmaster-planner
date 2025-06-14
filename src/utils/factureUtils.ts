
import { Facture } from "@/types/facture";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  let dateObj: Date;
  if (typeof date === 'string') {
    // Handle both DD/MM/YYYY and ISO string formats
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }
  
  return dateObj.toLocaleDateString('fr-FR');
};

export const parseDate = (date: string | Date): Date => {
  if (!date) return new Date();
  
  if (typeof date === 'string') {
    // Handle DD/MM/YYYY format
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      return new Date(date);
    }
  }
  
  return date;
};

export const calculateFactureStatus = (facture: Facture): string => {
  if (facture.status === 'annulée') {
    return 'Annulée';
  }

  if (facture.status_paiement === 'payée') {
    return 'Payée';
  }

  const solde = facture.montant - (facture.montant_paye || 0);
  if (solde <= 0) {
    return 'Payée';
  }

  if (facture.status_paiement === 'partiellement_payée') {
    return 'Partiellement payée';
  }

  return facture.status === 'brouillon' ? 'Brouillon' : 'Envoyée';
};

export const getStatusBadgeVariant = (status: string, type: "document" | "paiement"): "default" | "destructive" | "secondary" | "success" => {
  if (type === "document") {
    switch (status) {
      case 'brouillon':
        return 'secondary';
      case 'envoyée':
        return 'default';
      case 'annulée':
        return 'destructive';
      default:
        return 'default';
    }
  } else {
    switch (status) {
      case 'non_payée':
        return 'destructive';
      case 'partiellement_payée':
        return 'default';
      case 'payée':
        return 'success';
      case 'en_retard':
        return 'destructive';
      default:
        return 'default';
    }
  }
};

// Fonctions utilitaires pour les filtres de factures
export const applySearchFilter = (factures: Facture[], searchTerm: string): Facture[] => {
  if (!searchTerm) return factures;
  const term = searchTerm.toLowerCase();
  return factures.filter(facture => 
    facture.id.toLowerCase().includes(term) ||
    facture.client?.nom?.toLowerCase().includes(term) ||
    facture.notes?.toLowerCase().includes(term)
  );
};

export const applyStatusFilter = (factures: Facture[], statusFilter: string): Facture[] => {
  if (!statusFilter || statusFilter === 'all') return factures;
  return factures.filter(facture => facture.status === statusFilter);
};

export const applyClientFilter = (factures: Facture[], clientFilter: string): Facture[] => {
  if (!clientFilter || clientFilter === 'all') return factures;
  return factures.filter(facture => facture.client_id === clientFilter);
};

export const applyDateFilter = (factures: Facture[], dateFilter: string): Facture[] => {
  if (!dateFilter) return factures;
  const filterDate = new Date(dateFilter);
  return factures.filter(facture => {
    const factureDate = parseDate(facture.date);
    return factureDate.toDateString() === filterDate.toDateString();
  });
};

// Fonctions utilitaires pour la pagination
export const getPaginatedFactures = (factures: Facture[], page: number, itemsPerPage: number): Facture[] => {
  const startIndex = (page - 1) * itemsPerPage;
  return factures.slice(startIndex, startIndex + itemsPerPage);
};

export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};

// Fonction utilitaire pour le tri
export const sortFactures = (factures: Facture[], sortBy: string, sortOrder: 'asc' | 'desc'): Facture[] => {
  return [...factures].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'date':
        aValue = parseDate(a.date);
        bValue = parseDate(b.date);
        break;
      case 'montant':
        aValue = a.montant;
        bValue = b.montant;
        break;
      case 'client':
        aValue = a.client?.nom || '';
        bValue = b.client?.nom || '';
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }

    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });
};
