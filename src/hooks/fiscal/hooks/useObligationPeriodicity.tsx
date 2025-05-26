
import { useCallback } from 'react';
import { ObligationStatus, DeclarationObligationStatus, DeclarationPeriodicity } from '../types';

export function useObligationPeriodicity() {
  // Function to check if an obligation is a declaration
  const isDeclarationObligation = useCallback((obligation: string): boolean => {
    // Les obligations de type déclaration sont dsf, darp, licence, cntps, precomptes
    const annualDeclarations = ['dsf', 'darp'];
    const monthlyDeclarations = ['licence', 'cntps', 'precomptes'];
    
    return [...annualDeclarations, ...monthlyDeclarations].includes(obligation);
  }, []);
  
  // Function to check if an obligation is a direct tax
  const isDirectTax = useCallback((obligation: string): boolean => {
    // Les impôts directs sont igs et patente
    return ['igs', 'patente'].includes(obligation);
  }, []);

  // Function to check if a declaration is monthly
  const isMonthlyDeclaration = useCallback((obligation: string): boolean => {
    // Les déclarations mensuelles sont licence, cntps, precomptes
    return ['licence', 'cntps', 'precomptes'].includes(obligation);
  }, []);

  // Function to check if a declaration is annual
  const isAnnualDeclaration = useCallback((obligation: string): boolean => {
    // Les déclarations annuelles sont dsf et darp
    return ['dsf', 'darp'].includes(obligation);
  }, []);

  // Function to update periodicity of declaration obligations
  const updatePeriodicity = useCallback((obligation: string, status: ObligationStatus, periodicity: DeclarationPeriodicity) => {
    if (isDeclarationObligation(obligation)) {
      // Check if the status has the properties of a DeclarationObligationStatus
      if ('depose' in status && 'periodicity' in status) {
        // Use type assertion to safely cast to DeclarationObligationStatus
        return {
          ...status,
          periodicity
        } as DeclarationObligationStatus;
      }
    }
    return status;
  }, [isDeclarationObligation]);

  return {
    isDeclarationObligation,
    isDirectTax,
    isMonthlyDeclaration,
    isAnnualDeclaration,
    updatePeriodicity
  };
}
