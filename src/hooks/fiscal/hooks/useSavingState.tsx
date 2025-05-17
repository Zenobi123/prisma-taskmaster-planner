
import { useState, useCallback } from 'react';
import { ClientFiscalData } from '../types';
import { saveFiscalData } from '../services/saveService';
import { toast } from 'sonner';

export function useSavingState(clientId: string, setHasUnsavedChanges: (value: boolean) => void) {
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveAttempts, setSaveAttempts] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const isSaving = saveStatus === 'saving';

  // Save all fiscal data - Manual save only
  const handleSaveData = useCallback(async (updatedFiscalData: ClientFiscalData) => {
    try {
      if (!clientId) {
        console.error("Missing client ID");
        setSaveStatus('error');
        setLastSaveSuccess(false);
        setSaveAttempts(prev => prev + 1);
        return false;
      }

      setSaveStatus('saving');
      
      // Add timestamp to track updates and prepare data for saving
      const dataWithTimestamp = {
        ...updatedFiscalData,
        updatedAt: new Date().toISOString()
      };
      
      const success = await saveFiscalData(clientId, dataWithTimestamp);

      if (success) {
        setSaveStatus('success');
        setLastSaveSuccess(true);
        setSaveAttempts(prev => prev + 1);
        setHasUnsavedChanges(false);
        return true;
      } else {
        console.error("Error saving fiscal data");
        setSaveStatus('error');
        setLastSaveSuccess(false);
        setSaveAttempts(prev => prev + 1);
        return false;
      }
    } catch (err) {
      console.error("Error in saveFiscalData:", err);
      setSaveStatus('error');
      setLastSaveSuccess(false);
      setSaveAttempts(prev => prev + 1);
      return false;
    }
  }, [clientId, setHasUnsavedChanges]);

  return {
    lastSaveSuccess,
    saveAttempts,
    isSaving,
    handleSaveData
  };
}
