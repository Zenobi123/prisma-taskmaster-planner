
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Client } from '@/types/client';
import { useFiscalAttestation } from './hooks/useFiscalAttestation';
import { useFiscalData } from './hooks/useFiscalData';
import { useFiscalSave } from './hooks/useFiscalSave';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { ClientFiscalData } from './types';

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
  
  const { hasUnsavedChanges } = useUnsavedChanges(
    clientId,
    creationDate,
    validityEndDate,
    obligationStatuses,
    showInAlert,
    hiddenFromDashboard
  );

  // Function to handle status changes in obligations
  const handleStatusChange = useCallback((obligation: string, field: string, value: any) => {
    if (!obligationStatuses) return;
    
    console.log(`Updating ${obligation}.${field} to:`, value);
    
    setObligationStatuses(prev => {
      if (!prev) return prev;
      
      const newState = { ...prev };
      
      // If the field includes a dot, it's a nested property
      if (field.includes('.')) {
        const parts = field.split('.');
        let current = newState[obligation] as any;
        
        // Navigate to the parent object
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        // Set the value on the leaf property
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
      } else {
        // Direct property on the obligation
        (newState[obligation] as any)[field] = value;
      }
      
      return newState;
    });
  }, [obligationStatuses, setObligationStatuses]);

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
