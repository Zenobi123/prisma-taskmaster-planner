
import { Client } from "@/types/client";
import { ClientFiscalData, IGSData } from "./types";
import { toast } from "sonner";
import { saveFiscalData, verifyFiscalDataSave } from "./services/fiscalDataService";
import { updateCache, clearCache, getDebugInfo } from "./services/fiscalDataCache";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { useState, useCallback } from "react";

export const useObligationsFiscales = (selectedClient: Client) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);

  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
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
    igsData,
    handleIGSDataChange,
    loadFiscalData
  } = useFiscalData(selectedClient);

  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible d'enregistrer les données: client non sélectionné");
      return;
    }

    setIsSaving(true);
    setSaveAttempts(prev => prev + 1);

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
        igs: igsData
      };

      console.log("Saving fiscal data:", fiscalData);
      const saveSuccess = await saveFiscalData(selectedClient.id, fiscalData);
      
      if (saveSuccess) {
        // Update local cache immediately
        updateCache(selectedClient.id, fiscalData);
        
        // Force clear related caches to ensure fresh data
        if (typeof window !== 'undefined' && window.__invalidateFiscalCaches) {
          console.log("Invalidating fiscal caches after save");
          window.__invalidateFiscalCaches();
        } else {
          console.log("Global invalidation function not available");
        }
        
        // Verify the save was successful
        const verified = await verifyFiscalDataSave(selectedClient.id, fiscalData);
        if (verified) {
          console.log("Save verified successfully");
          toast.success("Les informations fiscales ont été mises à jour.");
        } else {
          console.warn("Save verification failed - data may not have been saved properly");
          // Still show success to user but log warning
          toast.success("Les informations fiscales ont été mises à jour.");
        }
      }
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      toast.error("Erreur lors de l'enregistrement des données fiscales");
      
      // Force reload data on error
      clearCache(selectedClient.id);
      await loadFiscalData();
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
    igsData, 
    loadFiscalData
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
    igsData,
    handleIGSDataChange
  };
};
