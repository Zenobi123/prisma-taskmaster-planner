
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";

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
      
      // Add timestamp to track updates
      const dataToSave = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from("clients")
        .update({ fiscal_data: dataToSave })
        .eq("id", clientId);

      if (error) {
        console.error("Error saving fiscal data:", error);
        toast.error(`Erreur lors de l'enregistrement des données: ${error.message}`);
        setSaveStatus('error');
        return false;
      }

      toast.success("Données fiscales enregistrées avec succès");
      setHasUnsavedChanges(false);
      setSaveStatus('success');
      return true;
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
