
import { useEffect, useState, useCallback } from "react";
import { Client } from "@/types/client";
import { ClientFiscalData, ObligationStatuses } from "./types";
import { useFiscalData } from "./hooks/useFiscalData";
import { useFiscalSave } from "./hooks/useFiscalSave";
import { useUnsavedChanges } from "./hooks/useUnsavedChanges";

export function useObligationsFiscales(selectedClient: Client) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [lastSaveSuccess, setLastSaveSuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [creationDate, setCreationDate] = useState("");
  const [validityEndDate, setValidityEndDate] = useState("");
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses | null>(null);
  const [showInAlert, setShowInAlert] = useState(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(false);

  // Utiliser les hooks spécifiques
  const {
    fiscalData,
    selectedYear,
    setSelectedYear,
    fetchFiscalData,
    updateFiscalDataField
  } = useFiscalData(selectedClient.id);

  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleBeforeUnload
  } = useUnsavedChanges();

  const {
    saveFiscalData,
    saveStatus
  } = useFiscalSave(selectedClient.id, setHasUnsavedChanges);

  // Charger les données fiscales au chargement et quand le client ou l'année change
  useEffect(() => {
    if (selectedClient?.id) {
      setLoading(true);
      setError(null);
      
      fetchFiscalData()
        .then((data) => {
          if (data) {
            if (typeof data === 'object') {
              // Set creation date
              const creationDateValue = data.attestation?.creationDate || "";
              setCreationDate(creationDateValue);
              
              // Calculate validity end date (usually 3 months)
              if (creationDateValue) {
                try {
                  const parts = creationDateValue.split('/');
                  if (parts.length === 3) {
                    const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    date.setMonth(date.getMonth() + 3);
                    setValidityEndDate(`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`);
                  }
                } catch (err) {
                  console.error("Error calculating validity end date:", err);
                }
              }
              
              // Set obligation statuses
              if (data.obligations) {
                setObligationStatuses(data.obligations);
              }
              
              // Set alert and dashboard visibility settings
              setShowInAlert(data.attestation?.showInAlert !== false);
              setHiddenFromDashboard(data.hiddenFromDashboard === true);
            }
            
            setDataLoaded(true);
          }
          setLoading(false);
        })
        .catch(err => {
          setError("Erreur lors du chargement des données fiscales");
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedClient.id, selectedYear, fetchFiscalData]);

  // Update creation date and recalculate validity end date
  const handleCreationDateChange = (date: string) => {
    setCreationDate(date);
    
    try {
      if (date) {
        const parts = date.split('/');
        if (parts.length === 3) {
          const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          dateObj.setMonth(dateObj.getMonth() + 3);
          setValidityEndDate(`${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`);
        }
      } else {
        setValidityEndDate("");
      }
    } catch (err) {
      console.error("Error calculating validity end date:", err);
    }
    
    // Update the fiscal data
    updateFiscalDataField('attestation.creationDate', date);
    setHasUnsavedChanges(true);
  };

  // Handle toggle alert visibility
  const handleToggleAlert = () => {
    const newValue = !showInAlert;
    setShowInAlert(newValue);
    updateFiscalDataField('attestation.showInAlert', newValue);
    setHasUnsavedChanges(true);
  };

  // Handle toggle dashboard visibility
  const handleToggleDashboardVisibility = () => {
    const newValue = !hiddenFromDashboard;
    setHiddenFromDashboard(newValue);
    updateFiscalDataField('hiddenFromDashboard', newValue);
    setHasUnsavedChanges(true);
  };

  // Handle status changes for obligations
  const handleStatusChange = useCallback((obligation: string, field: string, value: boolean | string | number) => {
    if (!obligationStatuses) return;
    
    // Update the local state
    setObligationStatuses((prevStatuses) => {
      if (!prevStatuses) return null;
      
      const newStatuses = { ...prevStatuses };
      
      // Handle nested fields with dot notation
      if (field.includes('.')) {
        const parts = field.split('.');
        let current: any = newStatuses[obligation];
        
        // Navigate to the nested object
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        // Set the value
        current[parts[parts.length - 1]] = value;
      } else {
        (newStatuses[obligation] as any)[field] = value;
      }
      
      return newStatuses;
    });
    
    // Update the fiscal data
    updateFiscalDataField(`obligations.${obligation}.${field}`, value);
    setHasUnsavedChanges(true);
  }, [obligationStatuses, updateFiscalDataField, setHasUnsavedChanges]);

  // Handle attachment updates
  const handleAttachmentUpdate = useCallback((
    obligation: string, 
    isDeclaration: boolean, 
    attachmentType: string, 
    filePath: string | null
  ) => {
    if (!obligationStatuses) return;
    
    // Determine the correct path based on obligation type
    const fieldPath = isDeclaration 
      ? `obligations.${obligation}.attachments.${attachmentType}` 
      : `obligations.${obligation}.payment_attachments.${attachmentType}`;
    
    // Update the fiscal data
    updateFiscalDataField(fieldPath, filePath);
    setHasUnsavedChanges(true);
    
    // Update local state for UI
    setObligationStatuses((prevStatuses) => {
      if (!prevStatuses) return null;
      
      const newStatuses = JSON.parse(JSON.stringify(prevStatuses));
      const parts = fieldPath.split('.');
      
      // Navigate to the nested object
      let current: any = newStatuses;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      
      // Set the value
      current[parts[parts.length - 1]] = filePath;
      
      return newStatuses;
    });
  }, [obligationStatuses, updateFiscalDataField, setHasUnsavedChanges]);

  // Gestionnaire pour sauvegarder les données
  const handleSave = useCallback(async () => {
    if (fiscalData) {
      setIsSaving(true);
      setSaveAttempts(prev => prev + 1);
      
      // Create a deep clone to ensure we're not modifying the original data
      const updatedFiscalData: ClientFiscalData = JSON.parse(JSON.stringify(fiscalData));
      
      // Update attestation data in fiscal data
      if (typeof updatedFiscalData === 'object') {
        updatedFiscalData.attestation = {
          ...updatedFiscalData.attestation,
          creationDate,
          validityEndDate,
          showInAlert
        };
        
        updatedFiscalData.obligations = obligationStatuses || updatedFiscalData.obligations;
        updatedFiscalData.hiddenFromDashboard = hiddenFromDashboard;
        updatedFiscalData.selectedYear = selectedYear;
      }
      
      try {
        const success = await saveFiscalData(updatedFiscalData);
        setLastSaveSuccess(success);
      } finally {
        setIsSaving(false);
      }
    }
  }, [
    fiscalData, 
    creationDate, 
    validityEndDate, 
    showInAlert, 
    obligationStatuses, 
    hiddenFromDashboard, 
    selectedYear,
    saveFiscalData
  ]);

  return {
    fiscalData,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    updateFiscalDataField,
    handleSave,
    hasUnsavedChanges,
    saveStatus,
    creationDate,
    setCreationDate: handleCreationDateChange,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    isLoading: loading,
    dataLoaded,
    isSaving,
    saveAttempts,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    lastSaveSuccess
  };
}

export default useObligationsFiscales;
