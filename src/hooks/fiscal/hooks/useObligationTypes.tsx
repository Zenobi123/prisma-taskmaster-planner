
import { useCallback } from 'react';
import { ObligationType } from '../types';

export const useObligationTypes = () => {
  const isTaxObligation = useCallback((obligationType: ObligationType): boolean => {
    return ['igs', 'patente', 'licence', 'bailCommercial', 'precompteLoyer', 'tpf'].includes(obligationType);
  }, []);

  const isDeclarationObligation = useCallback((obligationType: ObligationType): boolean => {
    return ['dsf', 'darp', 'cntps', 'precomptes'].includes(obligationType);
  }, []);

  return {
    isTaxObligation,
    isDeclarationObligation
  };
};
