
import { useState, useEffect } from "react";
import { FiscalAlert, FiscalObligation } from "./fiscal/types";
import { fetchFiscalComplianceData } from "./fiscal/fiscalService";

export type { FiscalAlert, FiscalObligation } from "./fiscal/types";

export const useFiscalCompliance = () => {
  const [fiscalAlerts, setFiscalAlerts] = useState<FiscalAlert[]>([]);
  const [upcomingObligations, setUpcomingObligations] = useState<FiscalObligation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFiscalCompliance = async () => {
      try {
        setIsLoading(true);
        console.log("Calling fetchFiscalComplianceData...");
        const { fiscalAlerts, upcomingObligations } = await fetchFiscalComplianceData();
        console.log("Fiscal alerts loaded:", fiscalAlerts);
        setFiscalAlerts(fiscalAlerts);
        setUpcomingObligations(upcomingObligations);
      } catch (error) {
        console.error("Error loading fiscal compliance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFiscalCompliance();
  }, []);

  return {
    fiscalAlerts,
    upcomingObligations,
    isLoading
  };
};
