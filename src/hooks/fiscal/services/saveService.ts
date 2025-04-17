
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { clearCache, updateCache } from "./cacheService";
import { verifyFiscalDataSave } from "./verifyService";
import { Json } from "@/integrations/supabase/types";

/**
 * Save fiscal data with retry capability
 */
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData, retryCount = 0): Promise<boolean> => {
  try {
    console.log(`Saving fiscal data for client ${clientId} (attempt ${retryCount + 1})`);
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Error saving fiscal data (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1500;
        console.log(`Retrying save in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, fiscalData, retryCount + 1);
      }
      
      return false;
    }
    
    // Update cache with new data
    updateCache(clientId, fiscalData);
    
    // Verify save was successful
    const verified = await verifyFiscalDataSave(clientId, fiscalData);
    if (!verified && retryCount < 2) {
      console.log("Save verification failed, retrying...");
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    return verified;
  } catch (error) {
    console.error(`Exception during fiscal data save (attempt ${retryCount + 1}):`, error);
    clearCache(clientId); // Clear cache on error
    
    if (retryCount < 2) {
      const delay = (retryCount + 1) * 1500;
      console.log(`Retrying save in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    return false;
  }
};
