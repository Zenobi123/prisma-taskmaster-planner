
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Client } from '@/types/client';
import { useFiscalAttestation } from './hooks/useFiscalAttestation';
import { useFiscalData } from './hooks/useFiscalData';
import { useFiscalSave } from './hooks/useFiscalSave';
import { useObligationStatus } from './hooks/useObligationStatus';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { ObligationStatuses, ClientFiscalData } from './types';

export const useObligationsFiscales = (selectedClient: Client) => {
  const { toast } = useToast();
  const clientId = selectedClient?.id;
  
  const {
    creationDate, 
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility
  } = useFiscalAttestation(clientId);

  const {
    obligationStatuses,
    setObligationStatuses,
    resetObligationStatuses,
    isLoading,
    dataLoaded,
    loadFiscalData
  } = useFiscalData(clientId);

  const {
    saveAttempts,
    lastSaveSuccess,
    isSaving,
    handleSave
  } = useFiscalSave(clientId);

  const { handleStatusChange } = useObligationStatus(setObligationStatuses);
  
  const { hasUnsavedChanges } = useUnsavedChanges(
    clientId,
    creationDate,
    validityEndDate,
    obligationStatuses,
    showInAlert,
    hiddenFromDashboard
  );

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
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
    hasUnsavedChanges,
    loadFiscalData
  };
};
