
import { useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { useFiscalData } from "./hooks/useFiscalData";
import { useUnsavedChanges } from "./hooks/useUnsavedChanges";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationManagement } from "./hooks/useObligationManagement";
import { useYearSelector } from "./hooks/useYearSelector";
import { useSavingState } from "./hooks/useSavingState";
import { useObligationPeriodicity } from "./hooks/useObligationPeriodicity";

export type { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus, ObligationStatuses, DeclarationPeriodicity } from "./types";

export const useObligationsFiscales = (selectedClient: Client) => {
  // Load fiscal data
  const { 
    fiscalData, 
    setFiscalData, 
    isLoading, 
    loadFiscalData, 
    selectedYear: dataYear,
    setSelectedYear: setDataYear 
  } = useFiscalData(selectedClient.id);
  
  // Track unsaved changes
  const { hasUnsavedChanges, setHasUnsavedChanges, markAsChanged } = useUnsavedChanges();
  
  // Import obligation periodicity hook
  const { isDeclarationObligation, updatePeriodicity } = useObligationPeriodicity();
  
  // Manage obligations
  const {
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    initializeObligationStatuses,
  } = useObligationManagement(markAsChanged, updatePeriodicity);

  // Year selection
  const { 
    selectedYear, 
    handleYearChange 
  } = useYearSelector(fiscalData, initializeObligationStatuses);

  // Saving state
  const {
    lastSaveSuccess,
    saveAttempts,
    isSaving,
    handleSaveData
  } = useSavingState(selectedClient.id, setHasUnsavedChanges);

  // Fiscal attestation state and handlers
  const {
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    setCreationDate,
    setValidityEndDate,
    handleToggleAlert,
    handleToggleDashboardVisibility
  } = useFiscalAttestation(fiscalData, markAsChanged);

  // Initialize the state from the fiscal data
  useEffect(() => {
    if (fiscalData && typeof fiscalData === 'object') {
      // Attestation data
      if (fiscalData.attestation) {
        const attestation = fiscalData.attestation;
        setCreationDate(attestation.creationDate);
        setValidityEndDate(attestation.validityEndDate);
      }
      
      // Selected year
      if (fiscalData.selectedYear) {
        setDataYear(fiscalData.selectedYear);
        handleYearChange(fiscalData.selectedYear);
      } else {
        handleYearChange(selectedYear);
      }
      
      // Dashboard visibility
      if (fiscalData.hiddenFromDashboard !== undefined) {
        handleToggleDashboardVisibility(!!fiscalData.hiddenFromDashboard, false);
      }
    }
  }, [fiscalData, setCreationDate, setValidityEndDate, handleToggleDashboardVisibility, setDataYear, handleYearChange, selectedYear]);

  // Save all changes
  const handleSave = useCallback(async () => {
    if (!fiscalData || !selectedClient.id) return false;
    
    // Update fiscal data
    const updatedFiscalData = {
      ...fiscalData,
      attestation: {
        creationDate,
        validityEndDate,
        showInAlert
      },
      obligations: {
        ...(typeof fiscalData === 'object' && fiscalData.obligations ? fiscalData.obligations : {}),
        [selectedYear]: obligationStatuses
      },
      hiddenFromDashboard,
      selectedYear
    };
    
    const success = await handleSaveData(updatedFiscalData);
    if (success) {
      setFiscalData(updatedFiscalData);
      // Rechargement manuel des données après sauvegarde
      await loadFiscalData();
    }
    return success;
  }, [
    fiscalData, 
    selectedClient.id, 
    creationDate, 
    validityEndDate, 
    showInAlert, 
    obligationStatuses, 
    hiddenFromDashboard, 
    selectedYear, 
    handleSaveData, 
    setFiscalData,
    loadFiscalData
  ]);

  // Determine dataLoaded state for UI purposes
  const dataLoaded = !isLoading && fiscalData !== null;

  return {
    creationDate,
    validityEndDate,
    showInAlert,
    obligationStatuses,
    setCreationDate,
    handleStatusChange,
    handleAttachmentUpdate,
    handleSave,
    isLoading,
    dataLoaded,
    isSaving,
    saveAttempts,
    lastSaveSuccess,
    showInAlert, 
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    hasUnsavedChanges,
    selectedYear,
    setSelectedYear: handleYearChange,
    isDeclarationObligation,
  };
};
