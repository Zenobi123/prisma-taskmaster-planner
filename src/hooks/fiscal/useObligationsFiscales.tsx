
import { Client } from "@/types/client";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { useFiscalSave } from "./hooks/useFiscalSave";
import { useUnsavedChanges } from "./hooks/useUnsavedChanges";

export const useObligationsFiscales = (selectedClient: Client) => {
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

  const {
    isSaving,
    saveAttempts,
    lastSaveSuccess,
    lastSaveTime,
    handleSave: handleSaveOperation
  } = useFiscalSave(selectedClient?.id, loadFiscalData);

  const { hasUnsavedChanges } = useUnsavedChanges({
    dataLoaded,
    lastSaveSuccess,
    isSaving,
    handleSave: async () => {
      const fiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses,
        hiddenFromDashboard,
        updatedAt: new Date().toISOString()
      };
      return handleSaveOperation(fiscalData);
    }
  });

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave: async () => {
      const fiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses,
        hiddenFromDashboard,
        updatedAt: new Date().toISOString()
      };
      return handleSaveOperation(fiscalData);
    },
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
