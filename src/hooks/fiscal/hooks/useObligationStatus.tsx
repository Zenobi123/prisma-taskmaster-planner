
import { useState, useEffect } from "react";
import { ObligationStatuses } from "../types";

export const useObligationStatus = () => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    igs: { assujetti: false, paye: false },
    patente: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false }
  });

  // Handle nested updates like 'igs.paiementsTrimestriels.T1.isPaid'
  const handleStatusChange = (key: string, value: any) => {
    console.log(`useObligationStatus: Updating ${key} to:`, value);
    
    // Handle nested paths like 'igs.paiementsTrimestriels.T1.isPaid'
    if (key.includes('.')) {
      const parts = key.split('.');
      const obligationType = parts[0] as keyof ObligationStatuses;
      
      setObligationStatuses(prev => {
        // Create a deep copy of the current state
        const updated = JSON.parse(JSON.stringify(prev));
        
        // Navigate to the parent object that will contain our update
        let current = updated[obligationType];
        for (let i = 1; i < parts.length - 1; i++) {
          // Create empty objects for the path if they don't exist
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        // Set the final property
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
        
        console.log("Updated obligation statuses:", updated);
        return updated;
      });
    } else {
      // Simple updates like 'igs'
      setObligationStatuses(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  return {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  };
};
