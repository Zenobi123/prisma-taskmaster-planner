
import { useState, useEffect } from "react";
import { ClientFiscalData } from "../types";
import { fetchFiscalData } from "../services/fetchService";
import { saveFiscalData } from "../services/saveService";
import { verifyFiscalDataSave } from "../services/verifyService";

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<ClientFiscalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  useEffect(() => {
    if (!clientId) return;
    
    const loadFiscalData = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const data = await fetchFiscalData(clientId);
        
        if (data) {
          // Vérification et correction des données
          const verifiedData = verifyFiscalDataSave(data);
          
          // Si l'année sélectionnée existe dans les données, utilisez-la
          if (typeof verifiedData === 'object' && verifiedData && 'selectedYear' in verifiedData) {
            setSelectedYear(verifiedData.selectedYear as string);
          }
          
          setFiscalData(verifiedData);
        } else {
          // Initialisation des données par défaut si aucune n'existe
          const currentYear = new Date().getFullYear().toString();
          const defaultData: ClientFiscalData = {
            attestation: {
              creationDate: null,
              validityEndDate: null,
              showInAlert: true
            },
            obligations: {
              // Initialize with empty required structure
              igs: { assujetti: false, paye: false },
              patente: { assujetti: false, paye: false },
              dsf: { assujetti: false, depose: false },
              darp: { assujetti: false, depose: false },
              iba: { assujetti: false, paye: false },
              baic: { assujetti: false, paye: false },
              ibnc: { assujetti: false, paye: false },
              ircm: { assujetti: false, paye: false },
              irf: { assujetti: false, paye: false },
              its: { assujetti: false, paye: false },
              licence: { assujetti: false, depose: false },
              precompte: { assujetti: false, paye: false },
              taxeSejour: { assujetti: false, paye: false },
              baillCommercial: { assujetti: false, paye: false }
            },
            hiddenFromDashboard: false,
            selectedYear: currentYear
          };
          
          setFiscalData(defaultData);
          setSelectedYear(currentYear);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données fiscales:", error);
        setLoadError("Impossible de charger les données fiscales");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFiscalData();
  }, [clientId]);
  
  return { 
    fiscalData, 
    setFiscalData, 
    isLoading, 
    loadError,
    selectedYear,
    setSelectedYear
  };
};
