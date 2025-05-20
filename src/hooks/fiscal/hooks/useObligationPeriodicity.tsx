
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
      // On utilise un cast explicite pour assurer la compatibilité des types
      const declStatus = status as DeclarationObligationStatus;
      return {
        ...declStatus,
        periodicity
      } as DeclarationObligationStatus;
    }
    return status;
  }, [isDeclarationObligation]);

  return {
    isDeclarationObligation,
    updatePeriodicity
  };
}
