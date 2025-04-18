
import { ClientFiscalData } from "../../types";

/**
 * Verify attestation data
 */
export const verifyAttestation = (
  savedAttestation: ClientFiscalData['attestation'],
  expectedAttestation: ClientFiscalData['attestation']
): boolean => {
  if (!savedAttestation && !expectedAttestation) {
    return true;
  }
  
  if (!savedAttestation || !expectedAttestation) {
    console.error("One of attestation objects is missing");
    return false;
  }
  
  if (savedAttestation.creationDate !== expectedAttestation.creationDate) {
    console.error(`Mismatch in attestation.creationDate: saved=${savedAttestation.creationDate}, expected=${expectedAttestation.creationDate}`);
    return false;
  }
  
  if (savedAttestation.validityEndDate !== expectedAttestation.validityEndDate) {
    console.error(`Mismatch in attestation.validityEndDate: saved=${savedAttestation.validityEndDate}, expected=${expectedAttestation.validityEndDate}`);
    return false;
  }
  
  if (savedAttestation.showInAlert !== expectedAttestation.showInAlert) {
    console.error(`Mismatch in attestation.showInAlert: saved=${savedAttestation.showInAlert}, expected=${expectedAttestation.showInAlert}`);
    return false;
  }
  
  return true;
};
