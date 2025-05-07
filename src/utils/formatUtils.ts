
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Format dates to French locale
export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return "-";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: fr });
};

// Format number as currency
export const formatMontant = (amount?: number): string => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(amount);
};

// Format currency
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(amount);
};

// Format number with commas
export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return "-";
  return new Intl.NumberFormat("fr-FR").format(num);
};

// Format percentage
export const formatPercentage = (value?: number): string => {
  if (value === undefined || value === null) return "-";
  return `${new Intl.NumberFormat("fr-FR", { 
    minimumFractionDigits: 1, 
    maximumFractionDigits: 1 
  }).format(value)}%`;
};
