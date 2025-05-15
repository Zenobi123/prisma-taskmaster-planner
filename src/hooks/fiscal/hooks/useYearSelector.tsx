
import { useState, useCallback } from 'react';
import { ObligationStatuses, ClientFiscalData } from '../types';
 
export function useYearSelector(fiscalData: ClientFiscalData | null, initializeObligationStatuses: (obligations: ObligationStatuses | undefined) => void) {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  // Update the year and reset the obligation statuses
  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
    
    if (fiscalData && typeof fiscalData === 'object' && fiscalData.obligations) {
      // Get the obligations for the selected year or initialize an empty object
      const yearObligations = fiscalData.obligations[year];
      initializeObligationStatuses(yearObligations);
    } else {
      initializeObligationStatuses(undefined);
    }
  }, [fiscalData, initializeObligationStatuses]);

  return {
    selectedYear,
    setSelectedYear,
    handleYearChange
  };
}
