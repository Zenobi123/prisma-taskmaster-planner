
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Client } from '@/types/client';
import { useFiscalAttestation } from './hooks/useFiscalAttestation';
import { useFiscalData } from './hooks/useFiscalData';
import { useFiscalSave } from './hooks/useFiscalSave';
import { useObligationStatus } from './hooks/useObligationStatus';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { ObligationStatuses } from './types';

export const useObligationsFiscales = (selectedClient: Client) => {
  const { toast } = useToast();
  const clientId = selectedClient?.id;
  
  const {
    creationDate, 
    setCreationDate,
    validityEndDate,
    showInAlert,
    setShowInAlert,
    hiddenFromDashboard,
    setHiddenFromDashboard
  } = useFiscalAttestation(clientId);

  const {
    obligationStatuses,
    setObligationStatuses,
    resetObligationStatuses,
    isLoading,
    dataLoaded
  } = useFiscalData(clientId);

  const {
    saveAttempts,
    setSaveAttempts,
    lastSaveSuccess,
    setLastSaveSuccess,
    isSaving,
    handleSave
  } = useFiscalSave(clientId, creationDate, validityEndDate, showInAlert, hiddenFromDashboard, obligationStatuses);

  const { handleStatusChange } = useObligationStatus(setObligationStatuses);
  
  const { hasUnsavedChanges } = useUnsavedChanges(
    clientId,
    creationDate,
    validityEndDate,
    obligationStatuses,
    showInAlert,
    hiddenFromDashboard
  );

  // Toggle pour l'alerte
  const handleToggleAlert = useCallback(() => {
    setShowInAlert(!showInAlert);
  }, [showInAlert, setShowInAlert]);

  // Toggle pour l'affichage au tableau de bord
  const handleToggleDashboardVisibility = useCallback(() => {
    setHiddenFromDashboard(!hiddenFromDashboard);
  }, [hiddenFromDashboard, setHiddenFromDashboard]);

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
