
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
      const newStatuses = { ...prev };

      if (field === "assujetti" && !value) {
        // Si on désactive l'assujettissement, on désactive aussi le paiement/dépôt
        const updatedObligation = { ...newStatuses[taxType] };
        if ('payee' in updatedObligation) {
          updatedObligation.payee = false;
        }
        if ('depose' in updatedObligation) {
          updatedObligation.depose = false;
        }
        newStatuses[taxType] = { ...updatedObligation, assujetti: value } as any;

        // Règle spéciale : Si on désactive IGS ou Patente, vérifier si on doit désactiver la DSF
        if (taxType === "igs" || taxType === "patente") {
          const stillSubjectToIgsOrPatente = 
            (taxType === "igs" ? newStatuses.patente.assujetti : newStatuses.igs.assujetti) ||
            (taxType === "patente" ? newStatuses.igs.assujetti : newStatuses.patente.assujetti);
          
          if (!stillSubjectToIgsOrPatente) {
            console.log("Disabling DSF as client is no longer subject to IGS or Patente");
            newStatuses.dsf = { 
              ...newStatuses.dsf, 
              assujetti: false, 
              depose: false 
            };
          }
        }
      } else if (field === "assujetti" && value && (taxType === "igs" || taxType === "patente")) {
        // Si on active IGS ou Patente, activer automatiquement la DSF
        console.log("Activating DSF as client is now subject to IGS or Patente");
        newStatuses[taxType] = { ...newStatuses[taxType], assujetti: value } as any;
        newStatuses.dsf = { ...newStatuses.dsf, assujetti: true };
      } else {
        // Cas normal : mise à jour simple du champ
        newStatuses[taxType] = { ...newStatuses[taxType], [field]: value } as any;
      }

      return newStatuses;
    });
    setHasUnsavedChanges(true);
  }, [setObligationStatuses, setHasUnsavedChanges]);

  return {
    handleFiscalYearChange,
    handleStatusChange
  };
};
