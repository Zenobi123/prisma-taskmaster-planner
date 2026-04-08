
import { useState, useCallback } from "react";
import { ClientFiscalData } from "../types";
import { saveFiscalData as saveFiscalDataService } from "../services/saveService";

export const useFiscalSave = (clientId: string, setHasUnsavedChanges: (value: boolean) => void) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const saveFiscalData = useCallback(async (data: ClientFiscalData) => {
    try {
      if (!clientId) {
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
        setHasUnsavedChanges(false);
        setSaveStatus('success');
        return true;
      } else {
        setSaveStatus('error');
        return false;
      }
    } catch (err) {
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
