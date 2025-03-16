
import { useState, useEffect } from "react";
import { parse, isValid, format, addMonths, differenceInDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { ObligationType, ObligationStatuses } from "../types";

export function useObligationsFiscales() {
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: true, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: true, depose: false },
    darp: { assujetti: false, depose: false }
  });

  useEffect(() => {
    if (creationDate) {
      try {
        // Date format is DD/MM/YYYY
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        
        if (datePattern.test(creationDate)) {
          const parsedDate = parse(creationDate, 'dd/MM/yyyy', new Date());
          
          if (isValid(parsedDate)) {
            localStorage.setItem('fiscalAttestationCreationDate', creationDate);
            
            // Calculate end date - 3 months after creation date
            const endDate = addMonths(parsedDate, 3);
            
            // Format the end date as DD/MM/YYYY
            setValidityEndDate(format(endDate, 'dd/MM/yyyy'));
            
            const today = new Date();
            const daysUntilExpiration = differenceInDays(endDate, today);
            
            if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
              toast({
                title: "Attention",
                description: `L'Attestation de Conformité Fiscale expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`,
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error calculating validity end date:", error);
      }
    }
  }, [creationDate]);

  const handleStatusChange = (
    obligationType: ObligationType, 
    statusType: "assujetti" | "paye" | "depose", 
    value: boolean
  ) => {
    setObligationStatuses(prev => {
      const newState = {
        ...prev,
        [obligationType]: {
          ...prev[obligationType],
          [statusType]: value
        }
      };
      
      localStorage.setItem(
        `fiscal${obligationType.charAt(0).toUpperCase() + obligationType.slice(1)}${statusType.charAt(0).toUpperCase() + statusType.slice(1)}`, 
        value.toString()
      );
      
      return newState;
    });
  };

  const handleSave = () => {
    // Save all data to localStorage
    Object.keys(obligationStatuses).forEach((key) => {
      const obligationType = key as ObligationType;
      const obligation = obligationStatuses[obligationType];
      
      if ('paye' in obligation) {
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti`, 
          obligation.assujetti.toString()
        );
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Paye`, 
          obligation.paye.toString()
        );
      } else if ('depose' in obligation) {
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti`, 
          obligation.assujetti.toString()
        );
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Depose`, 
          obligation.depose.toString()
        );
      }
    });
    
    if (creationDate) {
      localStorage.setItem('fiscalAttestationCreationDate', creationDate);
    }
    
    // Show success toast
    toast({
      title: "Modifications enregistrées",
      description: "Les informations fiscales ont été mises à jour.",
      variant: "default",
    });
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedObligations: Partial<ObligationStatuses> = {};
    
    Object.keys(obligationStatuses).forEach((key) => {
      const obligationType = key as ObligationType;
      const obligation = obligationStatuses[obligationType];
      
      const savedAssujetti = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti`);
      
      if (savedAssujetti !== null) {
        if ('paye' in obligation) {
          const savedPaye = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Paye`);
          savedObligations[obligationType] = {
            assujetti: savedAssujetti === 'true',
            paye: savedPaye === 'true'
          } as any;
        } else if ('depose' in obligation) {
          const savedDepose = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Depose`);
          savedObligations[obligationType] = {
            assujetti: savedAssujetti === 'true',
            depose: savedDepose === 'true'
          } as any;
        }
      }
    });
    
    if (Object.keys(savedObligations).length > 0) {
      setObligationStatuses(prev => ({
        ...prev,
        ...savedObligations
      }));
    }
    
    const savedCreationDate = localStorage.getItem('fiscalAttestationCreationDate');
    if (savedCreationDate) {
      setCreationDate(savedCreationDate);
    }
  }, []);

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave
  };
}
