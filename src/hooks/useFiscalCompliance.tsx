
import { useState, useEffect } from "react";
import { FiscalAlert, FiscalObligation } from "./fiscal/types";
import { fetchFiscalComplianceData } from "./fiscal/fiscalService";

export type { FiscalAlert, FiscalObligation } from "./fiscal/types";

export const useFiscalCompliance = () => {
  const [fiscalAlerts, setFiscalAlerts] = useState<FiscalAlert[]>([]);
  const [upcomingObligations, setUpcomingObligations] = useState<FiscalObligation[]>([]);

  useEffect(() => {
    const loadFiscalCompliance = async () => {
      try {
        const { fiscalAlerts, upcomingObligations } = await fetchFiscalComplianceData();
        setFiscalAlerts(fiscalAlerts);
        setUpcomingObligations(upcomingObligations);
      } catch (error) {
        console.error("Error loading fiscal compliance data:", error);
      }
    };
    
    loadFiscalCompliance();
  }, []);

  return {
    fiscalAlerts,
    upcomingObligations
  };
};
