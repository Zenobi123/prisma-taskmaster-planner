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
