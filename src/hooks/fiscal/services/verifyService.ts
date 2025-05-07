
import { ClientFiscalData } from '../types';

/**
 * Verify fiscal data changes to determine if data needs to be saved
 */
export const verifyFiscalDataChanges = (
  currentData: ClientFiscalData | null,
  newData: ClientFiscalData
): boolean => {
  if (!currentData) return true;

  // Compare attestation data
  const currentAttestation = currentData.attestation || {};
  const newAttestation = newData.attestation || {};
  
  if (
    currentAttestation.creationDate !== newAttestation.creationDate ||
    currentAttestation.validityEndDate !== newAttestation.validityEndDate ||
    currentAttestation.showInAlert !== newAttestation.showInAlert
  ) {
    return true;
  }

  // Compare visibility settings
  if (currentData.hiddenFromDashboard !== newData.hiddenFromDashboard) {
    return true;
  }

  // Compare obligations data
  const currentObligations = currentData.obligations || {};
  const newObligations = newData.obligations || {};

  const allKeys = new Set([
    ...Object.keys(currentObligations),
    ...Object.keys(newObligations),
  ]);

  for (const key of allKeys) {
    const currentStatus = currentObligations[key];
    const newStatus = newObligations[key];

    if (!currentStatus && newStatus) return true;
    if (currentStatus && !newStatus) return true;
    
    if (currentStatus && newStatus) {
      if (
        currentStatus.status !== newStatus.status ||
        currentStatus.lastFiled !== newStatus.lastFiled ||
        currentStatus.nextDue !== newStatus.nextDue ||
        currentStatus.montant !== newStatus.montant ||
        currentStatus.notes !== newStatus.notes ||
        currentStatus.isAssujetti !== newStatus.isAssujetti
      ) {
        return true;
      }

      // Check for changes in IGS quarterly payments
      if (key === 'igs' && currentStatus.paiementsTrimestriels && newStatus.paiementsTrimestriels) {
        const currentPayments = currentStatus.paiementsTrimestriels;
        const newPayments = newStatus.paiementsTrimestriels;

        for (const trimester of ['T1', 'T2', 'T3', 'T4']) {
          const currentPayment = currentPayments[trimester];
          const newPayment = newPayments[trimester];

          if (!currentPayment && newPayment) return true;
          if (currentPayment && !newPayment) return true;

          if (currentPayment && newPayment) {
            if (
              currentPayment.paid !== newPayment.paid ||
              currentPayment.date !== newPayment.date ||
              currentPayment.amount !== newPayment.amount ||
              currentPayment.receipt !== newPayment.receipt
            ) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
};

export const verifyFiscalDataSave = verifyFiscalDataChanges;
