
import { useState, useCallback } from "react";

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Function to mark state as modified
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Function to reset changes state
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
