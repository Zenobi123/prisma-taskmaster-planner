
import { useState, useEffect, useCallback } from 'react';
import { ObligationStatuses } from '../types';
import { fetchFiscalData, saveFiscalData } from '../services';
import { validateAndMigrateObligationStatuses, createDefaultObligationStatuses } from '../services/validationService';

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const loadFiscalData = useCallback(async (retryCount: number = 0) => {
    if (!clientId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchFiscalData(clientId, retryCount);
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

  // Helper function to get obligations for a specific year with proper validation
  const getObligationsForYear = useCallback((year: string): ObligationStatuses | undefined => {
    if (!fiscalData?.obligations?.[year]) {
      console.log(`Aucune obligation trouvée pour l'année ${year}, création d'une structure par défaut`);
      return createDefaultObligationStatuses();
    }
    
    const yearObligations = fiscalData.obligations[year];
    
    // Valider et migrer les obligations avant de les retourner
    const validatedObligations = validateAndMigrateObligationStatuses(yearObligations);
    
    console.log(`Obligations validées et migrées pour l'année ${year}`);
    return validatedObligations;
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
