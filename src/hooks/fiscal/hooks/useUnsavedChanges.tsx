
import { useState, useCallback } from "react";

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Function to mark the state as changed
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return { 
    hasUnsavedChanges, 
    setHasUnsavedChanges,
    markAsChanged
  };
};
