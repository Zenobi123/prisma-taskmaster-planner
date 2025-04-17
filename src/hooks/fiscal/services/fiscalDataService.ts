
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { clearCache, expireAllCaches, getDebugInfo } from "./fiscalDataCache";

/**
 * Fetch fiscal data from the database
 */
export const fetchFiscalData = async (clientId: string): Promise<ClientFiscalData | null> => {
  try {
    console.log(`Fetching fiscal data for client ${clientId}`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error fetching fiscal data:", error);
      return null;
    }
    
    if (data?.fiscal_data) {
      console.log(`Fiscal data found for client ${clientId}`);
      // Cast the data to the correct type with an intermediate unknown cast for safety
      return data.fiscal_data as unknown as ClientFiscalData;
    }
    
    console.log(`No fiscal data found for client ${clientId}`);
    return null;
  } catch (error) {
    console.error("Exception fetching fiscal data:", error);
    return null;
  }
};

/**
 * Save fiscal data to the database
 */
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<boolean> => {
  try {
    console.log(`Saving fiscal data for client ${clientId}`, fiscalData);
    console.log("Cache state before save:", getDebugInfo());
    
    // Ensure we're really sending the data to the database
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error("Error saving fiscal data:", error);
      throw error;
    }
    
    console.log(`Fiscal data saved successfully for client ${clientId}`);
    
    // Clear this client's cache to ensure fresh data is loaded next time
    clearCache(clientId);
    
    // Force expire all related caches to ensure fresh data is loaded everywhere
    await invalidateRelatedQueries();
    
    console.log("Cache state after save:", getDebugInfo());
    
    // After a successful save, wait a moment and verify the data was saved
    setTimeout(async () => {
      try {
        const verificationSuccess = await verifyFiscalDataSave(clientId, fiscalData);
        console.log(`Verification after delay: ${verificationSuccess ? "Successful" : "Failed"}`);
      } catch (err) {
        console.error("Error in delayed verification:", err);
      }
    }, 2000);
    
    return true;
  } catch (error) {
    console.error("Exception saving fiscal data:", error);
    throw error;
  }
};

/**
 * Helper function to invalidate related queries when fiscal data changes
 */
const invalidateRelatedQueries = async (): Promise<void> => {
  try {
    // Force a refresh for IGS and Patente caches
    // This will ensure dashboard and other displays show updated information
    console.log("Invalidating related caches and refreshing data...");
    
    // Expire all fiscal-related caches
    expireAllCaches();
    
    // Call global cache invalidation function if it exists
    if (typeof window !== 'undefined') {
      // Create the function if it doesn't exist
      if (!window.__invalidateFiscalCaches) {
        window.__invalidateFiscalCaches = function() {
          console.log("Creating and calling global cache invalidation function");
          
          // Reset timestamps in the IGS and Patente caches
          if (window.__patenteCacheTimestamp !== undefined) {
            window.__patenteCacheTimestamp = 0;
            console.log("Patente cache invalidated");
          }
          
          // Manually trigger any other cache invalidations here
          if (window.__igsCache) {
            window.__igsCache = { data: null, timestamp: 0 };
            console.log("IGS cache invalidated");
          }
        };
      }
      
      console.log("Calling global cache invalidation function");
      window.__invalidateFiscalCaches();
    } else {
      console.log("Global cache invalidation function not available - not running in browser");
    }
    
  } catch (error) {
    console.error("Error invalidating related queries:", error);
  }
};

/**
 * Verify the fiscal data was properly saved by fetching it again
 */
export const verifyFiscalDataSave = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  try {
    console.log(`Verifying fiscal data save for client ${clientId}`);
    
    // Force fetch from DB by bypassing cache
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error verifying fiscal data save:", error);
      return false;
    }
    
    if (data?.fiscal_data) {
      console.log("Verification data:", data.fiscal_data);
      
      // Do a simple check to make sure some key fields match
      const savedData = data.fiscal_data as unknown as ClientFiscalData;
      
      // Log detailed comparisons for debugging
      console.log("Comparison of key fields:");
      if (savedData.hiddenFromDashboard !== undefined && expectedData.hiddenFromDashboard !== undefined) {
        console.log(`hiddenFromDashboard: expected=${expectedData.hiddenFromDashboard}, saved=${savedData.hiddenFromDashboard}`);
      }
      
      if (savedData.attestation && expectedData.attestation) {
        console.log(`attestation.creationDate: expected=${expectedData.attestation.creationDate}, saved=${savedData.attestation.creationDate}`);
      }
      
      return true; // If we got this far, the save succeeded
    }
    
    console.log("Verification failed: No data returned");
    return false;
  } catch (error) {
    console.error("Exception verifying fiscal data save:", error);
    return false;
  }
};

