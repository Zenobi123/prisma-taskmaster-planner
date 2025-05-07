
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ClientFiscalData } from '../types';
import { saveClientFiscalData } from '../services';

export const useFiscalSave = (clientId: string) => {
  const { toast } = useToast();
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [lastSaveSuccess, setLastSaveSuccess] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (fiscalData: ClientFiscalData): Promise<boolean> => {
    if (!clientId) return false;
    
    setIsSaving(true);
    try {
      await saveClientFiscalData(clientId, fiscalData);
      setSaveAttempts(prev => prev + 1);
      setLastSaveSuccess(true);
      setLastSaveTime(Date.now());
      
      toast({
        title: 'Enregistrement réussi',
        description: 'Les données fiscales ont été mises à jour avec succès.',
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données fiscales:', error);
      setSaveAttempts(prev => prev + 1);
      setLastSaveSuccess(false);
      
      toast({
        title: 'Erreur d\'enregistrement',
        description: 'Un problème est survenu lors de la mise à jour des données fiscales.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveAttempts,
    lastSaveSuccess,
    lastSaveTime,
    isSaving,
    handleSave
  };
};
