
import { useState, useEffect } from "react";
import { FiscalAlert, FiscalObligation } from "./fiscal/types";
import { fetchFiscalComplianceData } from "./fiscal/fiscalService";

export type { FiscalAlert, FiscalObligation } from "./fiscal/types";

export const useFiscalCompliance = () => {
  const [fiscalAlerts, setFiscalAlerts] = useState<FiscalAlert[]>([]);
  const [upcomingObligations, setUpcomingObligations] = useState<FiscalObligation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFiscalCompliance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Calling fetchFiscalComplianceData...");
        const { fiscalAlerts, upcomingObligations } = await fetchFiscalComplianceData();
        console.log("Fiscal alerts loaded:", fiscalAlerts);
        console.log("Fiscal obligations loaded:", upcomingObligations);
        
        if (fiscalAlerts.length === 0) {
          console.log("WARNING: No fiscal alerts were loaded!");
        }
        
        setFiscalAlerts(fiscalAlerts);
        setUpcomingObligations(upcomingObligations);
      } catch (err) {
        console.error("Error loading fiscal compliance data:", err);
        setError(err instanceof Error ? err : new Error('Une erreur inconnue est survenue'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFiscalCompliance();
  }, []);

  return {
    fiscalAlerts,
    upcomingObligations,
    isLoading,
    error
  };
};
