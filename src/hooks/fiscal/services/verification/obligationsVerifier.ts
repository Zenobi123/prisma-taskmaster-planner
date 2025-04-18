
import { ClientFiscalData } from "../../types";

/**
 * Verify main fields of fiscal data
 */
export const verifyMainFields = (savedData: ClientFiscalData, expectedData: ClientFiscalData): boolean => {
  if (savedData.hiddenFromDashboard !== expectedData.hiddenFromDashboard) {
    console.error(`Mismatch in hiddenFromDashboard: saved=${savedData.hiddenFromDashboard}, expected=${expectedData.hiddenFromDashboard}`);
    return false;
  }
  
  // Check updatedAt only if it exists in expected data
  if (expectedData.updatedAt) {
    if (!savedData.updatedAt) {
      console.error("Missing updatedAt timestamp in saved data");
      return false;
    }
  }
  
  return true;
};

/**
 * Verify all obligations
 */
export const verifyObligations = (
  savedObligations: ClientFiscalData['obligations'], 
  expectedObligations: ClientFiscalData['obligations']
): boolean => {
  const obligationTypes = ['patente', 'igs', 'bail', 'taxeFonciere', 'dsf', 'darp'] as const;
  
  for (const type of obligationTypes) {
    if (expectedObligations[type]) {
      if (!savedObligations[type]) {
        console.error(`Missing obligation type ${type} in saved data`);
        return false;
      }
      
      const saved = savedObligations[type];
      const expected = expectedObligations[type];
      
      if (saved.assujetti !== expected.assujetti) {
        console.error(`Mismatch in ${type}.assujetti: saved=${saved.assujetti}, expected=${expected.assujetti}`);
        return false;
      }
      
      if ('paye' in expected && 'paye' in saved) {
        if (saved.paye !== expected.paye) {
          console.error(`Mismatch in ${type}.paye: saved=${saved.paye}, expected=${expected.paye}`);
          return false;
        }
      }
      
      if ('depose' in expected && 'depose' in saved) {
        if (saved.depose !== expected.depose) {
          console.error(`Mismatch in ${type}.depose: saved=${saved.depose}, expected=${expected.depose}`);
          return false;
        }
      }
    }
  }
  
  return true;
};
