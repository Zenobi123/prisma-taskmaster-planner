
import { useState, useCallback } from "react";
import { useClientData } from "./useClientData";
import { useInvoiceData } from "./useInvoiceData";
import { usePaymentData } from "./usePaymentData";
import { useClientStatusCalculator } from "./useClientStatusCalculator";

export const useFinancialDataFetcher = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  
  const { 
    clients, 
    isLoading: isClientsLoading, 
    fetchClients 
  } = useClientData();
  
  const { 
    invoices, 
    isLoading: isInvoicesLoading, 
    fetchInvoices 
  } = useInvoiceData();
  
  const { 
    payments, 
    isLoading: isPaymentsLoading, 
    fetchPayments 
  } = usePaymentData();

  const { clientsSummary, chartData } = useClientStatusCalculator(
    clients,
    invoices,
    payments
  );

  const isLoading = isClientsLoading || isInvoicesLoading || isPaymentsLoading || isRefetching;

  const fetchClientsFinancialData = useCallback(async () => {
    try {
      // Éviter de refetcher si déjà en cours
      if (isRefetching) return;
      
      setIsRefetching(true);
      
      // Utilisation de Promise.all pour paralléliser les requêtes
      await Promise.all([
        fetchClients(),
        fetchInvoices(),
        fetchPayments()
      ]);
      
    } catch { /* erreur ignoree volontairement */ } finally {
      setIsRefetching(false);
    }
  }, [fetchClients, fetchInvoices, fetchPayments, isRefetching]);

  return {
    clientsSummary,
    chartData,
    isLoading,
    fetchClientsFinancialData
  };
};
