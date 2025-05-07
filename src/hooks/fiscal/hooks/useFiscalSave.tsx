
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ClientFiscalData } from "../types";
import { saveFiscalData } from "../services/saveService";
import { verifyAndNotifyFiscalChanges } from "../services/verifyService";
import { updateCache, clearCache } from "../services/cacheService";
import { invalidateDsfCache } from "@/services/unfiledDsfService";
import { invalidatePatenteCache } from "@/services/unpaidPatenteService";
import { invalidateIgsCache } from "@/services/unpaidIgsService";

export const useFiscalSave = (clientId: string | undefined, loadFiscalData: (force: boolean) => Promise<void>) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [lastSaveSuccess, setLastSaveSuccess] = useState<boolean>(false);
  const [saveRetryCount, setSaveRetryCount] = useState(0);
  
  const queryClient = useQueryClient();

  const handleSave = useCallback(async (fiscalData: ClientFiscalData) => {
    if (!clientId) {
      toast.error("Cannot save data: no client selected");
      return false;
    }

    setIsSaving(true);
    setSaveAttempts(prev => prev + 1);
    setSaveRetryCount(0);

    try {
      const saveSuccess = await saveFiscalData(clientId, fiscalData);
      
      if (saveSuccess) {
        updateCache(clientId, fiscalData);
        toast.success("Data saved, verification in progress...");
        
        const verified = await verifyAndNotifyFiscalChanges(clientId, fiscalData);
        
        if (verified) {
          setLastSaveTime(Date.now());
          setLastSaveSuccess(true);
          
          // Invalider tous les caches pertinents
          invalidateDsfCache();
          invalidatePatenteCache();
          invalidateIgsCache();
          
          // Invalider toutes les requêtes pertinentes
          queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-summary"] });
          queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-section"] });
          queryClient.invalidateQueries({ queryKey: ["client-stats"] });
          
          return true;
        } else {
          if (saveRetryCount < 2) {
            setSaveRetryCount(prev => prev + 1);
            return handleSave(fiscalData);
          }
        }
      }
      
      setLastSaveSuccess(false);
      return false;
    } catch (error) {
      console.error("Error during fiscal data save:", error);
      toast.error("Error during save. Please refresh and try again.");
      setLastSaveSuccess(false);
      
      clearCache(clientId);
      loadFiscalData(true);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [clientId, saveRetryCount, queryClient, loadFiscalData]);

  return {
    isSaving,
    saveAttempts,
    lastSaveSuccess,
    lastSaveTime,
    handleSave
  };
};
