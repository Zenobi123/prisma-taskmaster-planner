
import { useState, useEffect, useCallback } from 'react';
import { ClientFiscalData, ObligationStatuses } from '../types';
import { fetchFiscalData } from '../services/fetchService';

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<ClientFiscalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  // Function to load fiscal data without notification
  const loadFiscalData = useCallback(async (showToast: boolean = false) => {
    try {
      if (!clientId) return;
      
      setIsLoading(true);
      
      const data = await fetchFiscalData(clientId);
      
      if (data) {
        console.log("Fiscal data loaded:", data);
        setFiscalData(data);
        
        // If year is stored, use it
        if (data.selectedYear) {
          setSelectedYear(data.selectedYear);
        }
      } else {
        console.log("No fiscal data found for client", clientId);
        // Initialize with empty data if nothing is found
        const currentYear = new Date().getFullYear().toString();
        const emptyObligations: ObligationStatuses = {
          igs: { 
            assujetti: false, 
            payee: false,
            paiementsTrimestriels: {
              Q1: { payee: false },
              Q2: { payee: false },
              Q3: { payee: false },
              Q4: { payee: false }
            }
          },
          patente: { assujetti: false, payee: false },
          dsf: { assujetti: false, depose: false, periodicity: "annuelle" },
          darp: { assujetti: false, depose: false, periodicity: "annuelle" },
          licence: { assujetti: false, depose: false, periodicity: "annuelle" },
          cntps: { assujetti: false, payee: false },
          precomptes: { assujetti: false, payee: false }
        };
        
        setFiscalData({
          clientId,
          year: currentYear,
          selectedYear: currentYear,
          attestation: {
            creationDate: '',
            validityEndDate: '',
            showInAlert: true
          },
          obligations: {
            [currentYear]: emptyObligations
          },
          hiddenFromDashboard: false
        });
      }
    } catch (err) {
      console.error("Error loading fiscal data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);
  
  // Load data on component mount, once only, without notification
  useEffect(() => {
    loadFiscalData(false);
  }, [loadFiscalData]);

  return {
    fiscalData,
    setFiscalData,
    isLoading,
    loadFiscalData,
    selectedYear,
    setSelectedYear
  };
};
