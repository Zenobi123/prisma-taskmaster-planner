
import { useState, useCallback } from "react";
import { ObligationStatuses, ObligationType, TaxObligationStatus, DeclarationObligationStatus } from "../types";
import { useObligationTypes } from "./useObligationTypes";

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

export const useObligationManagement = (markAsChanged: () => void) => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(defaultObligationStatuses);
  const { isTaxObligation, isDeclarationObligation } = useObligationTypes();

  const initializeObligationStatuses = useCallback((obligations: ObligationStatuses | undefined) => {
    if (obligations) {
      // Merge with defaults to ensure all obligations are present
      const mergedObligations: ObligationStatuses = {
        // Direct taxes - merge with defaults
        igs: { ...defaultObligationStatuses.igs, ...obligations.igs },
        patente: { ...defaultObligationStatuses.patente, ...obligations.patente },
        licence: { ...defaultObligationStatuses.licence, ...obligations.licence },
        bailCommercial: { ...defaultObligationStatuses.bailCommercial, ...obligations.bailCommercial },
        precompteLoyer: { ...defaultObligationStatuses.precompteLoyer, ...obligations.precompteLoyer },
        tpf: { ...defaultObligationStatuses.tpf, ...obligations.tpf },
        // Declarations - merge with defaults
        dsf: { ...defaultObligationStatuses.dsf, ...obligations.dsf },
        darp: { ...defaultObligationStatuses.darp, ...obligations.darp },
        cntps: { ...defaultObligationStatuses.cntps, ...obligations.cntps },
        precomptes: { ...defaultObligationStatuses.precomptes, ...obligations.precomptes }
      };
      setObligationStatuses(mergedObligations);
    } else {
      setObligationStatuses(defaultObligationStatuses);
    }
  }, []);

  const handleStatusChange = useCallback((obligationType: ObligationType, field: string, value: string | number | boolean) => {
    console.log(`Updating ${obligationType}.${field} to:`, value);
    
    setObligationStatuses(prev => {
      const currentObligation = prev[obligationType];
      const updatedObligation = { ...currentObligation };
      
      // Handle specific field updates based on obligation type
      if (field === 'assujetti' && !value) {
        // If turning off assujetti, also turn off payee/depose
        if (isTaxObligation(obligationType)) {
          (updatedObligation as TaxObligationStatus).payee = false;
        } else if (isDeclarationObligation(obligationType)) {
          (updatedObligation as DeclarationObligationStatus).depose = false;
        }
      }
      
      // Type-safe field update
      (updatedObligation as any)[field] = value;
      
      const newStatuses: ObligationStatuses = {
        ...prev,
        [obligationType]: updatedObligation
      };
      
      markAsChanged();
      return newStatuses;
    });
  }, [markAsChanged, isTaxObligation, isDeclarationObligation]);

  const handleAttachmentUpdate = useCallback((obligationType: ObligationType, attachmentType: string, filePath: string | null) => {
    setObligationStatuses(prev => {
      const currentObligation = prev[obligationType];
      const updatedObligation = { ...currentObligation };
      
      if (!updatedObligation.attachements) {
        updatedObligation.attachements = {};
      }
      
      if (filePath) {
        updatedObligation.attachements[attachmentType] = filePath;
      } else {
        delete updatedObligation.attachements[attachmentType];
      }
      
      const newStatuses: ObligationStatuses = {
        ...prev,
        [obligationType]: updatedObligation
      };
      
      markAsChanged();
      return newStatuses;
    });
  }, [markAsChanged]);

  return {
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    initializeObligationStatuses,
    isDeclarationObligation,
    isTaxObligation,
  };
};
