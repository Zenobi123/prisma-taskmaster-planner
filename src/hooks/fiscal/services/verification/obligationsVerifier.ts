
import { ClientFiscalData } from "../../types";

/**
 * Verify main fields of fiscal data
 */
export const verifyMainFields = (savedData: ClientFiscalData, expectedData: ClientFiscalData): boolean => {
  if (savedData.hiddenFromDashboard !== expectedData.hiddenFromDashboard) {
    return false;
  }
  
  // Check updatedAt only if it exists in expected data
  if (expectedData.updatedAt) {
    if (!savedData.updatedAt) {
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
      return false;
    }

    const savedYearData = savedObligations[year];
    const expectedYearData = expectedObligations[year];
    
    const obligationTypes = ['patente', 'igs', 'dsf', 'darp', 'licence', 'cntps', 'precomptes'] as const;
    
    for (const type of obligationTypes) {
      if (expectedYearData[type] && !savedYearData[type]) {
        return false;
      }
      
      if (expectedYearData[type]) {
        const saved = savedYearData[type];
        const expected = expectedYearData[type];
        
        if (saved.assujetti !== expected.assujetti) {
          return false;
        }
        
        if ('payee' in expected && 'payee' in saved) {
          if (saved.payee !== expected.payee) {
            return false;
          }
        }
        
        if ('depose' in expected && 'depose' in saved) {
          if (saved.depose !== expected.depose) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
};
