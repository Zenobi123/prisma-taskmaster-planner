
import { useState, useEffect, useCallback } from 'react';
import { ClientFiscalData } from '../types';
import { fetchFiscalData } from '../services/fetchService';
import { toast } from 'sonner';

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<ClientFiscalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  // Fonction pour charger les données fiscales sans notification
  const loadFiscalData = useCallback(async (showToast: boolean = false) => {
    try {
      if (!clientId) return;
      
      setIsLoading(true);
      
      const data = await fetchFiscalData(clientId);
      
      if (data) {
        console.log("Données fiscales chargées:", data);
        setFiscalData(data);
        
        // Si l'année est stockée, on l'utilise
        if (data.selectedYear) {
          setSelectedYear(data.selectedYear);
        }
        
        if (showToast) {
          toast.success("Données fiscales chargées avec succès");
        }
      } else {
        console.log("Aucune donnée fiscale trouvée pour le client", clientId);
        // Initialiser avec des données vides si rien n'est trouvé
        setFiscalData({
          attestation: {
            creationDate: '',
            validityEndDate: '',
            showInAlert: true
          },
          obligations: {},
          hiddenFromDashboard: false
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données fiscales:", err);
      if (showToast) {
        toast.error("Erreur lors du chargement des données fiscales");
      }
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);
  
  // Charger les données au montage du composant, une seule fois, sans notification
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
