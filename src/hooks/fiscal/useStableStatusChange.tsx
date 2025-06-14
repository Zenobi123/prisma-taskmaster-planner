
import { useCallback, useRef } from 'react';
import { ObligationType } from './types';

interface UseStableStatusChangeProps {
  handleStatusChange: (taxType: ObligationType, field: string, value: boolean | string | number) => void;
}

export const useStableStatusChange = ({ handleStatusChange }: UseStableStatusChangeProps) => {
  const lastValuesRef = useRef<Record<string, any>>({});

  const stableHandleStatusChange = useCallback((
    taxType: ObligationType, 
    field: string, 
    value: boolean | string | number
  ) => {
    const key = `${taxType}.${field}`;
    
    // Vérifier si la valeur a vraiment changé
    if (lastValuesRef.current[key] === value) {
      return; // Pas de changement, éviter la mise à jour
    }
    
    // Stocker la nouvelle valeur
    lastValuesRef.current[key] = value;
    
    // Effectuer la mise à jour
    handleStatusChange(taxType, field, value);
  }, [handleStatusChange]);

  return stableHandleStatusChange;
};
