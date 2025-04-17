
import { Client } from "@/types/client";
import { ClientFiscalData, IGSData } from "./types";
import { toast } from "sonner";
import { saveFiscalData } from "./services/fiscalDataService";
import { updateCache, clearCache } from "./services/fiscalDataCache";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { useState } from "react";

export const useObligationsFiscales = (selectedClient: Client) => {
  const [isSaving, setIsSaving] = useState(false);

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
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange,
    loadFiscalData
  } = useFiscalData(selectedClient);

  const handleSave = async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible d'enregistrer les données: client non sélectionné");
      return;
    }

    setIsSaving(true);

    try {
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
        }
        
        toast.success("Les informations fiscales ont été mises à jour.");
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
  };

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    isSaving,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange
  };
};
