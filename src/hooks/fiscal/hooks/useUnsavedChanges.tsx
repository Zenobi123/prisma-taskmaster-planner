
import { useState, useEffect, useCallback } from "react";

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Function to mark the state as changed
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Handle page unload to warn user of unsaved changes
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?";
      return e.returnValue;
    }
  }, [hasUnsavedChanges]);

  // Add beforeunload event listener when hasUnsavedChanges is true
  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, handleBeforeUnload]);

  return { 
    hasUnsavedChanges, 
    setHasUnsavedChanges,
    markAsChanged,
    handleBeforeUnload
  };
};
