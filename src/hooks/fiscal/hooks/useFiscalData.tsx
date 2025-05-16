
import { useState, useEffect, useCallback } from "react";
import { ClientFiscalData } from "../types";
import { fetchFiscalData } from "../services/fetchService";
import { verifyFiscalDataSave } from "../services/verifyService";

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<ClientFiscalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Fonction de chargement exposée pour permettre le rechargement manuel
  const loadFiscalData = useCallback(async () => {
    if (!clientId) return false;

    setIsLoading(true);
    setLoadError(null);
    
    try {
      const data = await fetchFiscalData(clientId);
      
      if (data) {
        // Verify and correct data
        const verifiedData = verifyFiscalDataSave(data);
        
        // Use selected year from data if it exists
        if (typeof verifiedData === 'object' && verifiedData && 'selectedYear' in verifiedData) {
          setSelectedYear(verifiedData.selectedYear as string);
        }
        
        setFiscalData(verifiedData);
      } else {
        // Initialize default data if none exists
        const currentYear = new Date().getFullYear().toString();
        const defaultData: ClientFiscalData = {
          attestation: {
            creationDate: null,
            validityEndDate: null,
            showInAlert: true
          },
          obligations: {
            [currentYear]: {
              igs: { assujetti: false, paye: false },
              patente: { assujetti: false, paye: false },
              dsf: { assujetti: false, depose: false, periodicity: "annual" },
              darp: { assujetti: false, depose: false, periodicity: "annual" },
              iba: { assujetti: false, paye: false },
              baic: { assujetti: false, paye: false },
              ibnc: { assujetti: false, paye: false },
              ircm: { assujetti: false, paye: false },
              irf: { assujetti: false, paye: false },
              its: { assujetti: false, paye: false },
              licence: { assujetti: false, depose: false, periodicity: "annual" },
              precompte: { assujetti: false, paye: false },
              taxeSejour: { assujetti: false, paye: false },
              baillCommercial: { assujetti: false, paye: false }
            }
          },
          hiddenFromDashboard: false,
          selectedYear: currentYear
        };
        
        setFiscalData(defaultData);
        setSelectedYear(currentYear);
      }
      return true;
    } catch (error) {
      console.error("Error loading fiscal data:", error);
      setLoadError("Could not load fiscal data");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);
  
  // Chargement initial des données
  useEffect(() => {
    if (!clientId) return;
    loadFiscalData();
  }, [clientId, loadFiscalData]);
  
  return { 
    fiscalData, 
    setFiscalData, 
    isLoading, 
    loadError,
    loadFiscalData,  // Expose la fonction de rechargement
    selectedYear,
    setSelectedYear
  };
};
