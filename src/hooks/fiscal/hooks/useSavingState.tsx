
import { useState, useCallback } from 'react';
import { ClientFiscalData } from '../types';
import { useFiscalSave } from './useFiscalSave';
import { toast } from 'sonner';

export function useSavingState(clientId: string, setHasUnsavedChanges: (value: boolean) => void) {
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveAttempts, setSaveAttempts] = useState<number>(0);
  
  const { saveFiscalData, saveStatus } = useFiscalSave(clientId, setHasUnsavedChanges);
  const isSaving = saveStatus === 'saving';

  // Save all fiscal data - Manual save only
  const handleSaveData = useCallback(async (updatedFiscalData: ClientFiscalData) => {
    try {
      if (!clientId) {
        toast.error("Erreur: Identifiant de client non fourni");
        setSaveStatus('error');
        return false;
      }

      setSaveStatus('saving');
      
      // Add timestamp to track updates and prepare data for saving
      const dataWithTimestamp = {
        ...updatedFiscalData,
        updatedAt: new Date().toISOString()
      };
      
      const success = await saveFiscalData(dataWithTimestamp);

      if (success) {
        toast.success("Données fiscales enregistrées avec succès");
        setHasUnsavedChanges(false);
        setSaveStatus('success');
        return true;
      } else {
        console.error("Error saving fiscal data");
        toast.error("Erreur lors de l'enregistrement des données");
        setSaveStatus('error');
        return false;
      }
    } catch (err) {
      console.error("Error in saveFiscalData:", err);
      toast.error("Erreur lors de l'enregistrement des données");
      setSaveStatus('error');
      return false;
    }
  }, [clientId, setHasUnsavedChanges, saveFiscalData]);

  const setSaveStatus = (status: 'idle' | 'saving' | 'success' | 'error') => {
    if (status === 'success') {
      setLastSaveSuccess(true);
      setSaveAttempts(prev => prev + 1);
    } else if (status === 'error') {
      setLastSaveSuccess(false);
      setSaveAttempts(prev => prev + 1);
    }
  };

  return {
    lastSaveSuccess,
    saveAttempts,
    isSaving,
    handleSaveData
  };
}
