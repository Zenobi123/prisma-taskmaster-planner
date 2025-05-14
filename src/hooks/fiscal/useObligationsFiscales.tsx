
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
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    igs: { assujetti: false, paye: false },
    patente: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false },
    iba: { assujetti: false, paye: false },
    baic: { assujetti: false, paye: false },
    ibnc: { assujetti: false, paye: false },
    ircm: { assujetti: false, paye: false },
    irf: { assujetti: false, paye: false },
    its: { assujetti: false, paye: false },
    licence: { assujetti: false, depose: false },
    precompte: { assujetti: false, paye: false },
    taxeSejour: { assujetti: false, paye: false },
    baillCommercial: { assujetti: false, paye: false }
  });

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
      
      // Obligations for the selected year
      if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
        const yearObligations = fiscalData.obligations[selectedYear as string] || {
          igs: { assujetti: false, paye: false },
          patente: { assujetti: false, paye: false },
          dsf: { assujetti: false, depose: false },
          darp: { assujetti: false, depose: false },
          iba: { assujetti: false, paye: false },
          baic: { assujetti: false, paye: false },
          ibnc: { assujetti: false, paye: false },
          ircm: { assujetti: false, paye: false },
          irf: { assujetti: false, paye: false },
          its: { assujetti: false, paye: false },
          licence: { assujetti: false, depose: false },
          precompte: { assujetti: false, paye: false },
          taxeSejour: { assujetti: false, paye: false },
          baillCommercial: { assujetti: false, paye: false }
        };
        setObligationStatuses(yearObligations);
      } else {
        setObligationStatuses({
          igs: { assujetti: false, paye: false },
          patente: { assujetti: false, paye: false },
          dsf: { assujetti: false, depose: false },
          darp: { assujetti: false, depose: false },
          iba: { assujetti: false, paye: false },
          baic: { assujetti: false, paye: false },
          ibnc: { assujetti: false, paye: false },
          ircm: { assujetti: false, paye: false },
          irf: { assujetti: false, paye: false },
          its: { assujetti: false, paye: false },
          licence: { assujetti: false, depose: false },
          precompte: { assujetti: false, paye: false },
          taxeSejour: { assujetti: false, paye: false },
          baillCommercial: { assujetti: false, paye: false }
        });
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
      const yearObligations = fiscalData.obligations[year] || {
        igs: { assujetti: false, paye: false },
        patente: { assujetti: false, paye: false },
        dsf: { assujetti: false, depose: false },
        darp: { assujetti: false, depose: false },
        iba: { assujetti: false, paye: false },
        baic: { assujetti: false, paye: false },
        ibnc: { assujetti: false, paye: false },
        ircm: { assujetti: false, paye: false },
        irf: { assujetti: false, paye: false },
        its: { assujetti: false, paye: false },
        licence: { assujetti: false, depose: false },
        precompte: { assujetti: false, paye: false },
        taxeSejour: { assujetti: false, paye: false },
        baillCommercial: { assujetti: false, paye: false }
      };
      setObligationStatuses(yearObligations);
    } else {
      setObligationStatuses({
        igs: { assujetti: false, paye: false },
        patente: { assujetti: false, paye: false },
        dsf: { assujetti: false, depose: false },
        darp: { assujetti: false, depose: false },
        iba: { assujetti: false, paye: false },
        baic: { assujetti: false, paye: false },
        ibnc: { assujetti: false, paye: false },
        ircm: { assujetti: false, paye: false },
        irf: { assujetti: false, paye: false },
        its: { assujetti: false, paye: false },
        licence: { assujetti: false, depose: false },
        precompte: { assujetti: false, paye: false },
        taxeSejour: { assujetti: false, paye: false },
        baillCommercial: { assujetti: false, paye: false }
      });
    }
  }, [fiscalData, setSelectedYear]);

  // Handle status change for an obligation
  const handleStatusChange = useCallback((obligation: string, field: string, value: string | number | boolean) => {
    setObligationStatuses(prev => {
      const currentStatus = { ...prev[obligation as keyof ObligationStatuses] };
      // Set the field value dynamically
      (currentStatus as any)[field] = value;
      markAsChanged();
      return { ...prev, [obligation]: currentStatus };
    });
  }, [markAsChanged]);

  // Handle attachment update
  const handleAttachmentUpdate = useCallback((obligation: string, isDeclaration: boolean, attachmentType: string, filePath: string) => {
    setObligationStatuses(prev => {
      const currentStatus = { ...prev[obligation as keyof ObligationStatuses] };
      
      // Handle different attachment types based on declaration vs tax obligations
      if (isDeclaration) {
        if (!currentStatus.attachments) {
          (currentStatus as DeclarationObligationStatus).attachments = {};
        }
        (currentStatus as DeclarationObligationStatus).attachments![attachmentType] = filePath;
      } else {
        if (!currentStatus.payment_attachments) {
          (currentStatus as TaxObligationStatus).payment_attachments = {};
        }
        (currentStatus as TaxObligationStatus).payment_attachments![attachmentType] = filePath;
      }
      
      markAsChanged();
      return { ...prev, [obligation]: currentStatus };
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
    showInAlert: showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    hasUnsavedChanges,
    selectedYear,
    setSelectedYear: handleYearChange
  };
};
