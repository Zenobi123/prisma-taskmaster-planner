
import { useState, useCallback } from "react";

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Fonction pour marquer l'état comme modifié
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return { 
    hasUnsavedChanges, 
    setHasUnsavedChanges,
    markAsChanged
  };
};
