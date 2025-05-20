
import { useCallback } from 'react';
import { ObligationStatus, DeclarationObligationStatus } from '../types';

export function useObligationPeriodicity() {
  // Function to check if an obligation is a declaration
  const isDeclarationObligation = useCallback((obligation: string): boolean => {
    return ['dsf', 'darp', 'licence'].includes(obligation);
  }, []);

  // Function to update periodicity of declaration obligations
  const updatePeriodicity = useCallback((obligation: string, status: ObligationStatus, periodicity: "mensuelle" | "trimestrielle" | "annuelle") => {
    if (isDeclarationObligation(obligation)) {
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
