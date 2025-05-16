
import { useState, useCallback } from 'react';
import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus } from '../types';
import { useObligationPeriodicity } from './useObligationPeriodicity';

export function useObligationManagement(markAsChanged: () => void) {
  // Initialize with default obligation statuses
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    igs: { assujetti: false, paye: false },
    patente: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false, periodicity: "annual" },
    darp: { assujetti: false, depose: false, periodicity: "annual" },
    iba: { assujetti: false, paye: false },
    baic: { assujetti: false, paye: false },
    ibnc: { assujetti: false, paye: false },
    ircm: { assujetti: false, paye: false },
    irf: { assujetti: false, paye: false },
    its: { assujetti: false, paye: false },
    licence: { assujetti: false, depose: false, periodicity: "annual" },
    precompte: { assujetti: false, paye: false },
    taxeSejour: { assujetti: false, paye: false },
    baillCommercial: { assujetti: false, paye: false }
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
      if (isDeclaration) {
        const declarationStatus = currentStatus as DeclarationObligationStatus;
        if (!declarationStatus.attachments) {
          declarationStatus.attachments = {};
        }
        declarationStatus.attachments[attachmentType as keyof typeof declarationStatus.attachments] = filePath;
      } else {
        const taxStatus = currentStatus as TaxObligationStatus;
        if (!taxStatus.payment_attachments) {
          taxStatus.payment_attachments = {};
        }
        taxStatus.payment_attachments[attachmentType as keyof typeof taxStatus.payment_attachments] = filePath;
      }
      
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
        igs: { assujetti: false, paye: false },
        patente: { assujetti: false, paye: false },
        dsf: { assujetti: false, depose: false, periodicity: "annual" },
        darp: { assujetti: false, depose: false, periodicity: "annual" },
        iba: { assujetti: false, paye: false },
        baic: { assujetti: false, paye: false },
        ibnc: { assujetti: false, paye: false },
        ircm: { assujetti: false, paye: false },
        irf: { assujetti: false, paye: false },
        its: { assujetti: false, paye: false },
        licence: { assujetti: false, depose: false, periodicity: "annual" },
        precompte: { assujetti: false, paye: false },
        taxeSejour: { assujetti: false, paye: false },
        baillCommercial: { assujetti: false, paye: false }
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
