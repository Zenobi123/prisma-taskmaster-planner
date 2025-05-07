
import { useEffect } from "react";
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
    handleStatusChange,
    updateObligationsFromClientData,
    isInitialized
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

  // Mise à jour des données fiscales lorsque les données du client sont chargées
  useEffect(() => {
    if (dataLoaded && selectedClient?.fiscal_data && !isInitialized) {
      console.log("Initializing fiscal data from client:", selectedClient.id);
      try {
        // Initialiser les données d'attestation
        if (selectedClient.fiscal_data.attestation) {
          const attestation = selectedClient.fiscal_data.attestation;
          setCreationDate(attestation.creationDate || null);
          // Ne modifiez pas directement validityEndDate car c'est calculé à partir de creationDate
          
          // Initialiser l'état d'alerte avec une valeur explicite booléenne
          if (attestation.hasOwnProperty('showInAlert')) {
            handleToggleAlert(Boolean(attestation.showInAlert));
          }
        }
        
        // Initialiser les obligations fiscales
        if (selectedClient.fiscal_data.obligations) {
          updateObligationsFromClientData(selectedClient.fiscal_data);
        }
      } catch (error) {
        console.error("Error initializing fiscal data:", error);
      }
    }
  }, [dataLoaded, selectedClient, isInitialized, setCreationDate, handleToggleAlert, updateObligationsFromClientData]);

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
