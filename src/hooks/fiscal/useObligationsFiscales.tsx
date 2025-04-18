import { Client } from "@/types/client";
import { ClientFiscalData } from "./types";
import { toast } from "sonner";
import { saveFiscalData } from "./services/saveService";
import { verifyAndNotifyFiscalChanges } from "./services/verifyService";
import { updateCache, clearCache, getDebugInfo } from "./services/cacheService";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBeforeUnload } from "react-router-dom";

export const useObligationsFiscales = (selectedClient: Client) => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveRetryCount, setSaveRetryCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    showInAlert,
    handleToggleAlert
  } = useFiscalAttestation();

  const {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  } = useObligationStatus();

  const {
    isLoading,
    dataLoaded,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    loadFiscalData
  } = useFiscalData(selectedClient);

  useEffect(() => {
    if (dataLoaded) {
      setHasUnsavedChanges(true);
    }
  }, [creationDate, validityEndDate, showInAlert, obligationStatuses, hiddenFromDashboard]);

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
  }, [dataLoaded, hasUnsavedChanges, isSaving]);

  useEffect(() => {
    if (lastSaveTime && Date.now() - lastSaveTime > 60000) {
      console.log("More than 60 seconds since the last save, forcing data reload");
      loadFiscalData(true);
    }
  }, [lastSaveTime, loadFiscalData]);

  useEffect(() => {
    if (lastSaveSuccess && lastSaveTime) {
      const invalidationTimeout = setTimeout(() => {
        console.log("Automatic invalidation of requests after successful save");
        queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
      }, 2000);
      
      return () => clearTimeout(invalidationTimeout);
    }
  }, [lastSaveSuccess, lastSaveTime, queryClient]);

  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Cannot save data: no client selected");
      return;
    }

    setIsSaving(true);
    setSaveAttempts(prev => prev + 1);
    setSaveRetryCount(0);

    try {
      console.log("Starting fiscal data save...");
      console.log("Cache state before save:", getDebugInfo());
      
      const fiscalData: ClientFiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses,
        hiddenFromDashboard,
        updatedAt: new Date().toISOString()
      };

      console.log("Saving fiscal data:", JSON.stringify(fiscalData, null, 2));
      
      const saveSuccess = await saveFiscalData(selectedClient.id, fiscalData);
      
      if (saveSuccess) {
        updateCache(selectedClient.id, fiscalData);
        toast.success("Data saved, verification in progress...");
        setHasUnsavedChanges(false);
        
        const verified = await verifyAndNotifyFiscalChanges(selectedClient.id, fiscalData);
        
        if (verified) {
          console.log("Save successfully verified");
          setLastSaveTime(Date.now());
          setLastSaveSuccess(true);
          
          toast.success("✅ All changes have been verified and permanently saved.", {
            duration: 5000
          });
          
          queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
        } else {
          console.warn("Save verification failed");
          toast.warning("⚠️ Verification in progress... Data is saved but not yet confirmed.", {
            duration: 3000
          });
          setLastSaveSuccess(false);
          
          setTimeout(async () => {
            const secondVerification = await verifyAndNotifyFiscalChanges(selectedClient.id, fiscalData);
            if (secondVerification) {
              console.log("Second verification successful");
              setLastSaveSuccess(true);
              setHasUnsavedChanges(false);
              toast.success("✅ Changes have been verified and permanently saved.", {
                duration: 5000
              });
            } else {
              console.error("Second verification failed");
              if (saveRetryCount < 2) {
                setSaveRetryCount(prev => prev + 1);
                toast.error("⚠️ New save attempt...", {
                  duration: 3000
                });
                handleSave();
              } else {
                toast.error("❌ Problem with final save. Please refresh and try again.", {
                  duration: 5000
                });
              }
            }
          }, 3000);
        }
      } else {
        toast.error("Error during save. Please try again.");
        setLastSaveSuccess(false);
      }
    } catch (error) {
      console.error("Error during fiscal data save:", error);
      toast.error("Error during save. Please refresh and try again.");
      setLastSaveSuccess(false);
      
      clearCache(selectedClient.id);
      
      setTimeout(() => {
        loadFiscalData(true);
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedClient?.id, 
    creationDate, 
    validityEndDate, 
    showInAlert, 
    obligationStatuses, 
    hiddenFromDashboard,
    loadFiscalData,
    queryClient,
    saveRetryCount
  ]);

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    dataLoaded,
    isSaving,
    saveAttempts,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    lastSaveSuccess,
    hasUnsavedChanges
  };
};
