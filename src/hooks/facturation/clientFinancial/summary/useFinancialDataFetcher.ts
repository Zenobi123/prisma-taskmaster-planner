
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
      console.log("Récupération des données financières des clients...");
      
      // Utilisation de Promise.all pour paralléliser les requêtes
      await Promise.all([
        fetchClients(),
        fetchInvoices(),
        fetchPayments()
      ]);
      
      console.log("Données des clients récupérées avec succès", {
        clients: clientsSummary.length,
        chartData
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données financières des clients:", error);
    } finally {
      setIsRefetching(false);
    }
  }, [fetchClients, fetchInvoices, fetchPayments, clientsSummary.length, chartData, isRefetching]);

  return {
    clientsSummary,
    chartData,
    isLoading,
    fetchClientsFinancialData
  };
};
