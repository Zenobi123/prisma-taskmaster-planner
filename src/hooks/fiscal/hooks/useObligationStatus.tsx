
import { useState, useEffect, useCallback } from "react";
import { ObligationStatuses } from "../types";

export const useObligationStatus = () => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    igs: { assujetti: false, paye: false },
    patente: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false }
  });

  // Debug when obligation statuses change
  useEffect(() => {
    console.log("Current obligation statuses:", JSON.stringify(obligationStatuses, null, 2));
  }, [obligationStatuses]);

  // Handle nested updates like 'igs.paiementsTrimestriels.T1.isPaid'
  const handleStatusChange = useCallback((obligation: string, field: string, value: any) => {
    console.log(`useObligationStatus: Updating ${obligation}.${field} to:`, value);
    
    setObligationStatuses(prev => {
      // Create a deep copy to avoid mutation issues
      const updated = JSON.parse(JSON.stringify(prev));
      
      // Handle the special case where we're updating a direct obligation property
      if (field === "assujetti" || field === "paye" || field === "depose") {
        console.log(`Direct update to ${obligation}.${field}:`, value);
        if (!updated[obligation]) {
          updated[obligation] = {};
        }
        updated[obligation][field] = value;
      } 
      // Handle nested paths like 'paiementsTrimestriels.T1.isPaid'
      else if (field.includes('.')) {
        const parts = field.split('.');
        
        if (!updated[obligation]) {
          updated[obligation] = {};
        }
        
        // Navigate to the parent object that will contain our update
        let current = updated[obligation];
        for (let i = 0; i < parts.length - 1; i++) {
          // Create empty objects for the path if they don't exist
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        // Set the final property
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
        
        console.log(`Updated nested property ${obligation}.${field}:`, value);
      } 
      // Handle simple object properties
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
