
import { useState, useCallback } from "react";

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Fonction pour marquer l'état comme modifié
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Fonction pour réinitialiser l'état des changements
  const resetChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return { 
    hasUnsavedChanges, 
    setHasUnsavedChanges,
    markAsChanged,
    resetChanges
  };
};
