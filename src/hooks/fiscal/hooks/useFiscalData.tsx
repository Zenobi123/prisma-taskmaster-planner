
import { useState, useEffect, useCallback } from 'react';
import { ObligationStatuses } from '../types';
import { fetchFiscalData, saveFiscalData } from '../services';

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const loadFiscalData = useCallback(async (showNotification: boolean = true) => {
    if (!clientId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchFiscalData(clientId, showNotification);
      setFiscalData(data);
      
      // Set selected year from data or default to current year
      if (data?.selectedYear) {
        setSelectedYear(data.selectedYear);
      }
    } catch (error) {
      console.error('Error loading fiscal data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadFiscalData();
  }, [loadFiscalData]);

  // Helper function to get obligations for a specific year with proper typing
  const getObligationsForYear = useCallback((year: string): ObligationStatuses | undefined => {
    if (!fiscalData?.obligations?.[year]) return undefined;
    
    const yearObligations = fiscalData.obligations[year];
    
    // Ensure all required obligations are present with proper structure
    return {
      // Direct taxes
      igs: yearObligations.igs || { assujetti: false, payee: false },
      patente: yearObligations.patente || { assujetti: false, payee: false },
      licence: yearObligations.licence || { assujetti: false, payee: false },
      bailCommercial: yearObligations.bailCommercial || { assujetti: false, payee: false },
      precompteLoyer: yearObligations.precompteLoyer || { assujetti: false, payee: false },
      tpf: yearObligations.tpf || { assujetti: false, payee: false },
      // Declarations
      dsf: yearObligations.dsf || { assujetti: false, depose: false, periodicity: "annuelle" },
      darp: yearObligations.darp || { assujetti: false, depose: false, periodicity: "annuelle" },
      cntps: yearObligations.cntps || { assujetti: false, depose: false, periodicity: "mensuelle" },
      precomptes: yearObligations.precomptes || { assujetti: false, depose: false, periodicity: "mensuelle" }
    } as ObligationStatuses;
  }, [fiscalData]);

  return {
    fiscalData,
    setFiscalData,
    isLoading,
    loadFiscalData,
    selectedYear,
    setSelectedYear,
    getObligationsForYear
  };
};
