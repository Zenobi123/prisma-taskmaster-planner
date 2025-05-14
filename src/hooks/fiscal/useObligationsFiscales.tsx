
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatuses } from "./types";
import { useFiscalData } from "./hooks/useFiscalData";
import { useFiscalSave } from "./hooks/useFiscalSave";
import { useUnsavedChanges } from "./hooks/useUnsavedChanges";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";

export type { ObligationType, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus, ObligationStatuses } from "./types";

export const useObligationsFiscales = (selectedClient: Client) => {
  const { toast } = useToast();
  const { 
    fiscalData, 
    setFiscalData, 
    isLoading, 
    selectedYear,
    setSelectedYear 
  } = useFiscalData(selectedClient.id);
  
  const { hasUnsavedChanges, setHasUnsavedChanges, markAsChanged } = useUnsavedChanges();
  const { saveFiscalData, saveStatus } = useFiscalSave(selectedClient.id, setHasUnsavedChanges);
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveAttempts, setSaveAttempts] = useState<number>(0);
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({});

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
        setCreationDate(attestation.creationDate || null);
        setValidityEndDate(attestation.validityEndDate || null);
      }
      
      // Obligations for the selected year
      if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
        const yearObligations = fiscalData.obligations[selectedYear as string] || {};
        setObligationStatuses(yearObligations);
      } else {
        setObligationStatuses({});
      }
      
      // Dashboard visibility
      if (fiscalData.hiddenFromDashboard !== undefined) {
        handleToggleDashboardVisibility(!!fiscalData.hiddenFromDashboard, false);
      }
    }
  }, [fiscalData, selectedYear]);

  // Update the year and reset the obligation statuses
  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
    
    if (fiscalData && typeof fiscalData === 'object' && fiscalData.obligations) {
      // Get the obligations for the selected year or initialize an empty object
      const yearObligations = fiscalData.obligations[year] || {};
      setObligationStatuses(yearObligations);
    } else {
      setObligationStatuses({});
    }
  }, [fiscalData, setSelectedYear]);

  // Handle status change for an obligation
  const handleStatusChange = useCallback((key: string, status: TaxObligationStatus | DeclarationObligationStatus) => {
    setObligationStatuses(prev => {
      const newStatuses = { ...prev, [key]: status };
      markAsChanged();
      return newStatuses;
    });
  }, [markAsChanged]);

  // Handle attachment update
  const handleAttachmentUpdate = useCallback((key: string, attachmentUrl: string | null) => {
    setObligationStatuses(prev => {
      // Get the current status
      const currentStatus = prev[key];
      
      // Only update if the status exists and is an object
      if (currentStatus && typeof currentStatus === 'object') {
        // Create a new object with attachment updated
        const newStatus = {
          ...currentStatus,
          attachmentUrl
        };
        
        markAsChanged();
        return { ...prev, [key]: newStatus };
      }
      
      return prev;
    });
  }, [markAsChanged]);

  // Save all changes
  const handleSave = useCallback(async () => {
    if (!fiscalData || !selectedClient.id) return;
    
    // Mise à jour des données fiscales
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
    
    try {
      const success = await saveFiscalData(updatedFiscalData);
      setLastSaveSuccess(success);
      setSaveAttempts(prev => prev + 1);
      
      if (success) {
        setFiscalData(updatedFiscalData);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde."
      });
      setLastSaveSuccess(false);
      setSaveAttempts(prev => prev + 1);
    }
  }, [
    fiscalData, 
    selectedClient.id, 
    creationDate, 
    validityEndDate, 
    showInAlert, 
    obligationStatuses, 
    hiddenFromDashboard, 
    selectedYear, 
    saveFiscalData, 
    setFiscalData, 
    toast
  ]);

  // Determine dataLoaded state for UI purposes
  const dataLoaded = !isLoading && fiscalData !== null;

  // Auto-save on component unmount
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges) {
        handleSave();
      }
    };
  }, [hasUnsavedChanges, handleSave]);
  
  const isSaving = saveStatus === 'saving';

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
    setSelectedYear: handleYearChange
  };
};
