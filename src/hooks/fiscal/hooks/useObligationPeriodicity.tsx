
import { useCallback } from 'react';
import { ObligationStatus, DeclarationObligationStatus, DeclarationPeriodicity } from '../types';

export function useObligationPeriodicity() {
  // Function to check if an obligation is a declaration
  const isDeclarationObligation = useCallback((obligation: string): boolean => {
    return ['dsf', 'darp', 'licence'].includes(obligation);
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
    updatePeriodicity
  };
}
