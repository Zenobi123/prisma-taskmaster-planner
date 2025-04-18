
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { clearCache, updateCache } from "./cacheService";
import { verifyFiscalDataSave } from "./verifyService";
import { Json } from "@/integrations/supabase/types";

/**
 * Save fiscal data with enhanced persistence and verification
 */
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData, retryCount = 0): Promise<boolean> => {
  try {
    console.log(`Saving fiscal data for client ${clientId} (attempt ${retryCount + 1})`);
    
    // Ensure all required properties are present
    const completeData = {
      ...fiscalData,
      // Add updatedAt timestamp to ensure consistency
      updatedAt: new Date().toISOString(),
      // Add metadata for traceability
      _metadata: {
        lastSaved: new Date().toISOString(),
        saveVersion: (retryCount + 1).toString(),
        saveSource: 'Gestion'
      }
    };
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: completeData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Error saving fiscal data (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < 3) {
        const delay = (retryCount + 1) * 2000;
        console.log(`Retrying save in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, fiscalData, retryCount + 1);
      }
      
      return false;
    }
    
    // Pause to allow database to update
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Verify data was correctly saved
    const isVerified = await verifyFiscalDataSave(clientId, completeData);
    
    if (!isVerified && retryCount < 3) {
      console.warn(`Verification failed, retrying save (attempt ${retryCount + 1})...`);
      const delay = (retryCount + 1) * 2500;
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    if (isVerified) {
      // Update cache only after successful verification
      updateCache(clientId, completeData);
      console.log(`Fiscal data saved and verified for client ${clientId}`);
      
      // Invalidate global caches if defined
      if (typeof window !== 'undefined') {
        if (window.__patenteCacheTimestamp !== undefined) {
          window.__patenteCacheTimestamp = 0;
        }
        if (window.__igsCache) {
          window.__igsCache.timestamp = 0;
        }
        if (window.__dsfCacheTimestamp) {
          window.__dsfCacheTimestamp = 0;
        }
      }
    } else {
      console.error(`Final verification failed for client ${clientId} after ${retryCount + 1} attempts`);
      clearCache(clientId);
    }
    
    return isVerified;
  } catch (error) {
    console.error(`Exception during fiscal data save (attempt ${retryCount + 1}):`, error);
    clearCache(clientId);
    
    if (retryCount < 3) {
      const delay = (retryCount + 1) * 2000;
      console.log(`Retrying save after exception in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    return false;
  }
};
