
import { PeriodFilter } from "../types/AnalyseTypes";

export const getDateRangeForPeriod = (period: PeriodFilter): { startDate: Date, endDate: Date } => {
  const now = new Date();
  const startDate = new Date();
  
  if (period === "month") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (period === "quarter") {
    startDate.setMonth(now.getMonth() - 3);
  } else if (period === "year") {
    startDate.setFullYear(now.getFullYear() - 1);
  }
  
  return { startDate, endDate: now };
};

export const filterFacturesByPeriod = <
  T extends { date: string; client_id?: string; status_paiement?: string },
>(
  factures: T[],
  period: PeriodFilter,
  clientFilter: string | null,
  statusFilter: string | null,
): T[] => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  
  return factures.filter(facture => {
    // Convert YYYY-MM-DD to Date object
    const factureDate = new Date(facture.date);
    
    let includeFacture = factureDate >= startDate && factureDate <= endDate;
    
    // Apply client filter
    if (clientFilter) {
      includeFacture = includeFacture && facture.client_id === clientFilter;
    }
    
    // Apply status filter
    if (statusFilter) {
      includeFacture = includeFacture && facture.status_paiement === statusFilter;
    }
    
    return includeFacture;
  });
};
