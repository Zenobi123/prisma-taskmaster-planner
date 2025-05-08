
import { useState, useCallback, useEffect } from "react";

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // Handle beforeunload event to warn about unsaved changes
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?";
      return e.returnValue;
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleBeforeUnload
  };
};

export default useUnsavedChanges;
