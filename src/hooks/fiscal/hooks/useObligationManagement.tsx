
import { useState, useCallback, useEffect } from "react";
import { ObligationStatuses, ObligationType, TaxObligationStatus, DeclarationObligationStatus } from "../types";

const createDefaultObligationStatuses = (): ObligationStatuses => ({
  // Direct taxes
  igs: { assujetti: false, payee: false, attachements: {}, observations: "" },
  patente: { assujetti: false, payee: false, attachements: {}, observations: "" },
  licence: { assujetti: false, payee: false, attachements: {}, observations: "" },
  bailCommercial: { assujetti: false, payee: false, attachements: {}, observations: "" },
  precompteLoyer: { assujetti: false, payee: false, attachements: {}, observations: "" },
  tpf: { assujetti: false, payee: false, attachements: {}, observations: "" },
  // Declarations
  dsf: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
  darp: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
  cntps: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" },
  precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" }
});

export const useObligationManagement = (markAsChanged: () => void) => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(createDefaultObligationStatuses());

  const initializeObligationStatuses = useCallback((yearObligations?: ObligationStatuses) => {
    if (yearObligations) {
      // Merge with default structure to ensure all obligations exist
      const defaultStatuses = createDefaultObligationStatuses();
      const mergedStatuses = { ...defaultStatuses };
      
      // Merge existing data
      Object.keys(yearObligations).forEach(key => {
        if (mergedStatuses[key as ObligationType]) {
          mergedStatuses[key as ObligationType] = {
            ...mergedStatuses[key as ObligationType],
            ...yearObligations[key as ObligationType]
          };
        }
      });
      
      setObligationStatuses(mergedStatuses);
    } else {
      setObligationStatuses(createDefaultObligationStatuses());
    }
  }, []);

  const handleStatusChange = useCallback((obligation: string, field: string, value: string | number | boolean) => {
    console.log(`Updating ${obligation}.${field} to:`, value);
    
    setObligationStatuses(prev => {
      const updated = { ...prev };
      
      if (updated[obligation as ObligationType]) {
        updated[obligation as ObligationType] = {
          ...updated[obligation as ObligationType],
          [field]: value
        };
        
        // Handle cascading logic for assujetti changes
        if (field === "assujetti" && !value) {
          const currentObligation = updated[obligation as ObligationType];
          if ('payee' in currentObligation) {
            (currentObligation as TaxObligationStatus).payee = false;
          }
          if ('depose' in currentObligation) {
            (currentObligation as DeclarationObligationStatus).depose = false;
          }
        }
      }
      
      markAsChanged();
      return updated;
    });
  }, [markAsChanged]);

  const handleAttachmentUpdate = useCallback((obligation: string, attachmentType: string, filePath: string | null) => {
    setObligationStatuses(prev => {
      const updated = { ...prev };
      
      if (updated[obligation as ObligationType]) {
        const currentObligation = updated[obligation as ObligationType];
        const attachements = currentObligation.attachements || {};
        
        if (filePath) {
          attachements[attachmentType] = filePath;
        } else {
          delete attachements[attachmentType];
        }
        
        updated[obligation as ObligationType] = {
          ...currentObligation,
          attachements
        };
      }
      
      markAsChanged();
      return updated;
    });
  }, [markAsChanged]);

  const isTaxObligation = useCallback((obligation: string): boolean => {
    return ["igs", "patente", "licence", "bailCommercial", "precompteLoyer", "tpf"].includes(obligation);
  }, []);

  return {
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    initializeObligationStatuses,
    isTaxObligation
  };
};
