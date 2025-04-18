import { useState, useEffect, useCallback } from "react";
import { ObligationStatuses } from "../types";

export const useObligationStatus = () => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
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
  });

  useEffect(() => {
    console.log("Current obligation statuses:", JSON.stringify(obligationStatuses, null, 2));
  }, [obligationStatuses]);

  const handleStatusChange = useCallback((obligation: string, field: string, value: any) => {
    console.log(`useObligationStatus: Updating ${obligation}.${field} to:`, value);
    
    setObligationStatuses(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      if (field === "assujetti" || field === "paye" || field === "depose") {
        console.log(`Direct update to ${obligation}.${field}:`, value);
        if (!updated[obligation]) {
          updated[obligation] = {};
        }
        updated[obligation][field] = value;
      } 
      else if (field.includes('.')) {
        const parts = field.split('.');
        
        if (!updated[obligation]) {
          updated[obligation] = {};
        }
        
        let current = updated[obligation];
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
        
        console.log(`Updated nested property ${obligation}.${field}:`, value);
      } 
      else {
        console.log(`Simple property update to ${obligation}.${field}:`, value);
        if (!updated[obligation]) {
          updated[obligation] = {};
        }
        updated[obligation][field] = value;
      }
      
      console.log("Updated obligation statuses:", JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  return {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  };
};
