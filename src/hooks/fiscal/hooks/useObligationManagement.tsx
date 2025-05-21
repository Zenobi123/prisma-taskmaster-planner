
import { useState, useCallback } from 'react';
import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus } from '../types';
import { useObligationPeriodicity } from './useObligationPeriodicity';

export function useObligationManagement(markAsChanged: () => void) {
  // Initialize with default obligation statuses
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    // Impôts directs
    igs: { 
      assujetti: false, 
      payee: false,
      q1Payee: false,
      q2Payee: false,
      q3Payee: false,
      q4Payee: false
    },
    patente: { assujetti: false, payee: false },
    
    // Déclarations annuelles
    dsf: { assujetti: false, depose: false, periodicity: "annuelle" },
    darp: { assujetti: false, depose: false, periodicity: "annuelle" },
    
    // Déclarations mensuelles/autre périodicité
    licence: { assujetti: false, depose: false, periodicity: "mensuelle" },
    cntps: { assujetti: false, depose: false, periodicity: "mensuelle" },
    precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" }
  });

  const { isDeclarationObligation, isMonthlyDeclaration } = useObligationPeriodicity();

  // Handle status change for an obligation
  const handleStatusChange = useCallback((obligation: string, field: string, value: string | number | boolean) => {
    setObligationStatuses(prev => {
      const currentStatus = { ...prev[obligation as keyof ObligationStatuses] };
      // Set the field value dynamically
      (currentStatus as any)[field] = value;
      
      // For monthly declarations, set proper periodicity
      if (isDeclarationObligation(obligation) && isMonthlyDeclaration(obligation) && 'periodicity' in currentStatus) {
        (currentStatus as DeclarationObligationStatus).periodicity = "mensuelle";
      }
      
      markAsChanged();
      return { ...prev, [obligation]: currentStatus };
    });
  }, [markAsChanged, isDeclarationObligation, isMonthlyDeclaration]);

  // Handle attachment update
  const handleAttachmentUpdate = useCallback((obligation: string, attachmentType: string, filePath: string) => {
    setObligationStatuses(prev => {
      const currentStatus = { ...prev[obligation as keyof ObligationStatuses] };
      
      // Initialize attachements if not exist
      if (!currentStatus.attachements) {
        currentStatus.attachements = {};
      }
      
      // Set the attachment
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
        // Impôts directs
        igs: { 
          assujetti: false, 
          payee: false,
          q1Payee: false,
          q2Payee: false,
          q3Payee: false,
          q4Payee: false
        },
        patente: { assujetti: false, payee: false },
        
        // Déclarations annuelles
        dsf: { assujetti: false, depose: false, periodicity: "annuelle" },
        darp: { assujetti: false, depose: false, periodicity: "annuelle" },
        
        // Déclarations mensuelles/autre périodicité
        licence: { assujetti: false, depose: false, periodicity: "mensuelle" },
        cntps: { assujetti: false, depose: false, periodicity: "mensuelle" },
        precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" }
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
