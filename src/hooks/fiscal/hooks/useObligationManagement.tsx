
import { useState, useCallback } from 'react';
import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus } from '../types';
import { useObligationPeriodicity } from './useObligationPeriodicity';

export function useObligationManagement(markAsChanged: () => void) {
  // Initialize with default obligation statuses
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    igs: { 
      assujetti: false, 
      payee: false,
      paiementsTrimestriels: {
        Q1: { payee: false },
        Q2: { payee: false },
        Q3: { payee: false },
        Q4: { payee: false }
      }
    },
    patente: { assujetti: false, payee: false },
    dsf: { assujetti: false, depose: false, periodicity: "annuelle" },
    darp: { assujetti: false, depose: false, periodicity: "annuelle" },
    licence: { assujetti: false, depose: false, periodicity: "annuelle" },
    cntps: { assujetti: false, payee: false },
    precomptes: { assujetti: false, payee: false }
  });

  const { isDeclarationObligation } = useObligationPeriodicity();

  // Handle status change for an obligation
  const handleStatusChange = useCallback((obligation: string, field: string, value: string | number | boolean) => {
    setObligationStatuses(prev => {
      const currentStatus = { ...prev[obligation as keyof ObligationStatuses] };
      // Set the field value dynamically
      (currentStatus as any)[field] = value;
      markAsChanged();
      return { ...prev, [obligation]: currentStatus };
    });
  }, [markAsChanged]);

  // Handle attachment update
  const handleAttachmentUpdate = useCallback((obligation: string, isDeclaration: boolean, attachmentType: string, filePath: string) => {
    setObligationStatuses(prev => {
      const currentStatus = { ...prev[obligation as keyof ObligationStatuses] };
      
      // Handle different attachment types based on declaration vs tax obligations
      if (!currentStatus.attachements) {
        currentStatus.attachements = {};
      }
      currentStatus.attachements[attachmentType] = filePath;
      
      markAsChanged();
      return { ...prev, [obligation]: currentStatus };
    });
  }, [markAsChanged]);

  // Initialize obligation statuses from fiscal data
  const initializeObligationStatuses = useCallback((yearObligations: ObligationStatuses | undefined) => {
    if (yearObligations) {
      setObligationStatuses(yearObligations);
    } else {
      setObligationStatuses({
        igs: { 
          assujetti: false, 
          payee: false,
          paiementsTrimestriels: {
            Q1: { payee: false },
            Q2: { payee: false },
            Q3: { payee: false },
            Q4: { payee: false }
          }
        },
        patente: { assujetti: false, payee: false },
        dsf: { assujetti: false, depose: false, periodicity: "annuelle" },
        darp: { assujetti: false, depose: false, periodicity: "annuelle" },
        licence: { assujetti: false, depose: false, periodicity: "annuelle" },
        cntps: { assujetti: false, payee: false },
        precomptes: { assujetti: false, payee: false }
      });
    }
  }, []);

  return {
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    initializeObligationStatuses,
    isDeclarationObligation
  };
}
