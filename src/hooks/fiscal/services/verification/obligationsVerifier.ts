
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
  // Compare by year
  for (const year in expectedObligations) {
    if (!savedObligations[year]) {
      console.error(`Missing year ${year} in saved obligations`);
      return false;
    }

    const savedYearData = savedObligations[year];
    const expectedYearData = expectedObligations[year];
    
    const obligationTypes = ['patente', 'igs', 'dsf', 'darp', 'licence', 'cntps', 'precomptes'] as const;
    
    for (const type of obligationTypes) {
      if (expectedYearData[type] && !savedYearData[type]) {
        console.error(`Missing obligation type ${type} for year ${year} in saved data`);
        return false;
      }
      
      if (expectedYearData[type]) {
        const saved = savedYearData[type];
        const expected = expectedYearData[type];
        
        if (saved.assujetti !== expected.assujetti) {
          console.error(`Mismatch in ${type}.assujetti for year ${year}: saved=${saved.assujetti}, expected=${expected.assujetti}`);
          return false;
        }
        
        if ('payee' in expected && 'payee' in saved) {
          if (saved.payee !== expected.payee) {
            console.error(`Mismatch in ${type}.payee for year ${year}: saved=${saved.payee}, expected=${expected.payee}`);
            return false;
          }
        }
        
        if ('depose' in expected && 'depose' in saved) {
          if (saved.depose !== expected.depose) {
            console.error(`Mismatch in ${type}.depose for year ${year}: saved=${saved.depose}, expected=${expected.depose}`);
            return false;
          }
        }
      }
    }
  }
  
  return true;
};
