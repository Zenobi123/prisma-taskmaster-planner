
import { useCallback } from "react";
import { ObligationStatuses, ObligationType, ObligationStatus, TaxObligationStatus, DeclarationObligationStatus } from "./types";

interface UseObligationStatusHandlersProps {
  setObligationStatuses: React.Dispatch<React.SetStateAction<ObligationStatuses>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useObligationStatusHandlers = ({
  setObligationStatuses,
  setHasUnsavedChanges
}: UseObligationStatusHandlersProps) => {
  
  const handleFiscalYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasUnsavedChanges(true);
  }, [setHasUnsavedChanges]);

  const handleStatusChange = useCallback((obligation: string, field: string, value: string | number | boolean) => {
    
    setObligationStatuses(prev => {
      const updated: Record<string, ObligationStatus> = { ...prev };
      const obligationType = obligation as ObligationType;

      if (updated[obligationType]) {
        updated[obligationType] = {
          ...updated[obligationType],
          [field]: value
        };

        // Logique de cascade pour les changements d'assujetti
        if (field === "assujetti" && !value) {
          const currentObligation = updated[obligationType];
          if ('payee' in currentObligation) {
            (currentObligation as TaxObligationStatus).payee = false;
          }
          if ('depose' in currentObligation) {
            (currentObligation as DeclarationObligationStatus).depose = false;
          }
        }

      }

      setHasUnsavedChanges(true);
      return updated as unknown as ObligationStatuses;
    });
  }, [setObligationStatuses, setHasUnsavedChanges]);

  const handleAttachmentChange = useCallback((obligation: string, attachmentType: string, filePath: string | null) => {
    
    setObligationStatuses(prev => {
      const updated: Record<string, ObligationStatus> = { ...prev };
      const obligationType = obligation as ObligationType;

      if (updated[obligationType]) {
        const currentObligation = updated[obligationType];
        const attachements = currentObligation.attachements || {};

        if (filePath) {
          attachements[attachmentType] = filePath;
        } else {
          delete attachements[attachmentType];
        }

        updated[obligationType] = {
          ...currentObligation,
          attachements
        };

      }

      setHasUnsavedChanges(true);
      return updated as unknown as ObligationStatuses;
    });
  }, [setObligationStatuses, setHasUnsavedChanges]);

  return {
    handleFiscalYearChange,
    handleStatusChange,
    handleAttachmentChange
  };
};
