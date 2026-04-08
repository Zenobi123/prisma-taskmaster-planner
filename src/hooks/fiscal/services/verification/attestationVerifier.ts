
import { ClientFiscalData } from "../../types";

/**
 * Verify attestation data
 */
export const verifyAttestation = (
  savedData: ClientFiscalData,
  expectedData: ClientFiscalData
): boolean => {
  const savedAttestation = savedData.attestation;
  const expectedAttestation = expectedData.attestation;
  
  if (!savedAttestation && !expectedAttestation) {
    return true;
  }
  
  if (!savedAttestation || !expectedAttestation) {
    return false;
  }
  
  if (savedAttestation.creationDate !== expectedAttestation.creationDate) {
    return false;
  }
  
  if (savedAttestation.validityEndDate !== expectedAttestation.validityEndDate) {
    return false;
  }
  
  if (savedAttestation.showInAlert !== expectedAttestation.showInAlert) {
    return false;
  }
  
  return true;
};
