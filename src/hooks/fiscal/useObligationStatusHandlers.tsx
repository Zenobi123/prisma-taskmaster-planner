
import { useCallback } from "react";
import { ObligationStatuses, ObligationType } from "./types";

interface UseObligationStatusHandlersProps {
  setObligationStatuses: React.Dispatch<React.SetStateAction<ObligationStatuses>>;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useObligationStatusHandlers = ({
  setObligationStatuses,
  setHasUnsavedChanges
}: UseObligationStatusHandlersProps) => {
  const handleFiscalYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasUnsavedChanges(true);
  }, [setHasUnsavedChanges]);

  // Gestion des changements d'état d'assujettissement et de paiement
  const handleStatusChange = useCallback((taxType: ObligationType, field: string, value: boolean) => {
    setObligationStatuses(prev => {
      if (field === "assujetti" && !value) {
        // Si on désactive l'assujettissement, on désactive aussi le paiement/dépôt
        const updatedObligation = { ...prev[taxType] };
        if ('payee' in updatedObligation) {
          (updatedObligation as any).payee = false;
        }
        if ('depose' in updatedObligation) {
          (updatedObligation as any).depose = false;
        }
        return {
          ...prev,
          [taxType]: { ...updatedObligation, assujetti: value }
        };
      }

      return {
        ...prev,
        [taxType]: { ...prev[taxType], [field]: value }
      };
    });
    setHasUnsavedChanges(true);
  }, [setObligationStatuses, setHasUnsavedChanges]);

  return {
    handleFiscalYearChange,
    handleStatusChange
  };
};
