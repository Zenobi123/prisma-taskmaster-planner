
import { useState, useCallback } from 'react';
import { ClientFiscalData } from '../types';
import { useFiscalSave } from './useFiscalSave';
import { useToast } from '@/components/ui/use-toast';

export function useSavingState(clientId: string, setHasUnsavedChanges: (value: boolean) => void) {
  const { toast } = useToast();
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveAttempts, setSaveAttempts] = useState<number>(0);
  
  const { saveFiscalData, saveStatus } = useFiscalSave(clientId, setHasUnsavedChanges);
  const isSaving = saveStatus === 'saving';

  // Save all fiscal data
  const handleSaveData = useCallback(async (updatedFiscalData: ClientFiscalData) => {
    try {
      const success = await saveFiscalData(updatedFiscalData);
      setLastSaveSuccess(success);
      setSaveAttempts(prev => prev + 1);
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde."
      });
      setLastSaveSuccess(false);
      setSaveAttempts(prev => prev + 1);
      return false;
    }
  }, [saveFiscalData, toast]);

  return {
    lastSaveSuccess,
    saveAttempts,
    isSaving,
    handleSaveData
  };
}
