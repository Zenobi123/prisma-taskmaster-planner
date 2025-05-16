
import { useState, useCallback } from "react";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";
import { saveFiscalData as saveFiscalDataService } from "../services/saveService";

export const useFiscalSave = (clientId: string, setHasUnsavedChanges: (value: boolean) => void) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const saveFiscalData = useCallback(async (data: ClientFiscalData) => {
    try {
      if (!clientId) {
        toast.error("Erreur: Identifiant de client non fourni");
        setSaveStatus('error');
        return false;
      }

      setSaveStatus('saving');
      
      // Add timestamp to track updates and prepare data for saving
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const success = await saveFiscalDataService(clientId, dataWithTimestamp);

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
  }, [clientId, setHasUnsavedChanges]);

  return {
    saveFiscalData,
    saveStatus
  };
};

export default useFiscalSave;
