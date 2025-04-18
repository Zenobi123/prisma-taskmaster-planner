
import { useState, useEffect, useCallback } from "react";
import { useBeforeUnload } from "react-router-dom";

interface UseUnsavedChangesProps {
  dataLoaded: boolean;
  lastSaveSuccess: boolean;
  isSaving: boolean;
  handleSave: () => Promise<boolean>;
}

export const useUnsavedChanges = ({
  dataLoaded,
  lastSaveSuccess,
  isSaving,
  handleSave
}: UseUnsavedChangesProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges && !lastSaveSuccess) {
          const message = "You have unsaved changes. Are you sure you want to leave this page?";
          event.preventDefault();
          event.returnValue = message;
          return message;
        }
      },
      [hasUnsavedChanges, lastSaveSuccess]
    )
  );

  useEffect(() => {
    if (dataLoaded) {
      setHasUnsavedChanges(true);
    }
  }, [dataLoaded]);

  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout;

    if (dataLoaded && hasUnsavedChanges && !isSaving) {
      autoSaveInterval = setInterval(() => {
        console.log("Auto-saving fiscal data...");
        handleSave();
      }, 120000); // 2 minutes
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [dataLoaded, hasUnsavedChanges, isSaving, handleSave]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges
  };
};
