
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { clearCache, expireAllCaches } from "./fiscalDataCache";

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
    if (typeof window !== 'undefined' && window.__invalidateFiscalCaches) {
      window.__invalidateFiscalCaches();
    }
    
  } catch (error) {
    console.error("Error invalidating related queries:", error);
  }
};
