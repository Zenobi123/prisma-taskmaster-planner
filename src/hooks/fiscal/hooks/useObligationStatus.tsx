
import { useState, useCallback } from "react";
import { DeclarationObligationStatus, TaxObligationStatus, ObligationStatus, DeclarationPeriodicity } from "../types";

export const useObligationStatus = () => {
  const getDefaultObligations = useCallback(() => {
    return {
      tax: { 
        assujetti: false, 
        payee: false 
      } as TaxObligationStatus,
      declaration: { 
        assujetti: false, 
        depose: false, 
        periodicity: "annuelle" as DeclarationPeriodicity
      } as DeclarationObligationStatus
    };
  }, []);

  const [obligationDefaults] = useState(getDefaultObligations());

  const getDefaultStatusByType = useCallback((type: "tax" | "declaration"): ObligationStatus => {
    return type === "tax" 
      ? { ...obligationDefaults.tax } 
      : { ...obligationDefaults.declaration };
  }, [obligationDefaults]);

  return { 
    getDefaultStatusByType 
  };
};
