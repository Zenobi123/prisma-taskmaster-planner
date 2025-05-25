
import { useState, useCallback } from "react";
import { ObligationStatuses } from "../types";

const defaultObligationStatuses: ObligationStatuses = {
  // Direct taxes
  igs: { assujetti: false, payee: false },
  patente: { assujetti: false, payee: false },
  licence: { assujetti: false, payee: false },
  bailCommercial: { assujetti: false, payee: false },
  precompteLoyer: { assujetti: false, payee: false },
  tpf: { assujetti: false, payee: false },
  // Declarations
  dsf: { assujetti: false, depose: false, periodicity: "annuelle" },
  darp: { assujetti: false, depose: false, periodicity: "annuelle" },
  cntps: { assujetti: false, depose: false, periodicity: "mensuelle" },
  precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" }
};

export const useUnifiedObligations = (markAsChanged: () => void) => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(defaultObligationStatuses);

  const initializeObligationStatuses = useCallback((obligations: ObligationStatuses | undefined) => {
    if (obligations) {
      // Merge with defaults to ensure all obligations are present
      const mergedObligations = {
        ...defaultObligationStatuses,
        ...obligations
      };
      setObligationStatuses(mergedObligations);
    } else {
      setObligationStatuses(defaultObligationStatuses);
    }
  }, []);

  // Unified handler compatible with existing frontend patterns
  const handleStatusChange = useCallback((taxType: string, field: string, value: boolean | string | number) => {
    console.log(`Updating ${taxType}.${field} to:`, value);
    
    setObligationStatuses(prev => {
      // Handle key mapping for compatibility with existing frontend
      const obligationKey = taxType === 'bail-commercial' 
        ? 'bailCommercial' 
        : taxType === 'precompte-loyer' 
          ? 'precompteLoyer' 
          : taxType;

      const updatedObligation = { ...prev[obligationKey as keyof ObligationStatuses] };
      
      // Handle specific field updates
      if (field === 'assujetti' && !value) {
        // If turning off assujetti, also turn off payee/depose
        if ('payee' in updatedObligation) {
          (updatedObligation as any).payee = false;
        }
        if ('depose' in updatedObligation) {
          (updatedObligation as any).depose = false;
        }
      }
      
      (updatedObligation as any)[field] = value;
      
      const newStatuses = {
        ...prev,
        [obligationKey]: updatedObligation
      };
      
      markAsChanged();
      return newStatuses;
    });
  }, [markAsChanged]);

  const handleAttachmentUpdate = useCallback((obligation: string, attachmentType: string, filePath: string | null) => {
    setObligationStatuses(prev => {
      const updatedObligation = { ...prev[obligation as keyof ObligationStatuses] };
      
      if (!updatedObligation.attachements) {
        updatedObligation.attachements = {};
      }
      
      if (filePath) {
        updatedObligation.attachements[attachmentType] = filePath;
      } else {
        delete updatedObligation.attachements[attachmentType];
      }
      
      const newStatuses = {
        ...prev,
        [obligation]: updatedObligation
      };
      
      markAsChanged();
      return newStatuses;
    });
  }, [markAsChanged]);

  // Helper functions to maintain compatibility
  const isDeclarationObligation = useCallback((obligation: string): boolean => {
    return ["dsf", "darp", "cntps", "precomptes"].includes(obligation);
  }, []);

  const isTaxObligation = useCallback((obligation: string): boolean => {
    return ["igs", "patente", "licence", "bailCommercial", "precompteLoyer", "tpf"].includes(obligation);
  }, []);

  return {
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    initializeObligationStatuses,
    isDeclarationObligation,
    isTaxObligation,
  };
};
