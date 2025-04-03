
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, defaultClientFiscalData } from "../types";
import { getFromCache, updateCache } from "./fiscalDataCache";

// Fetch fiscal data for a client
export const getFiscalData = async (clientId: string): Promise<ClientFiscalData> => {
  try {
    // Check if data is in cache
    const cachedData = getFromCache(clientId);
    if (cachedData) {
      return cachedData;
    }

    // Retrieve fiscal data from database
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error("Error retrieving fiscal data:", error);
      return defaultClientFiscalData;
    }

    // Parse and convert the data
    const fiscalData = data.fiscal_data ? 
      (typeof data.fiscal_data === 'string' 
        ? JSON.parse(data.fiscal_data) 
        : data.fiscal_data as unknown as ClientFiscalData) 
      : defaultClientFiscalData;

    // Update cache
    updateCache(clientId, fiscalData);

    return fiscalData;
  } catch (error) {
    console.error("Error retrieving fiscal data:", error);
    return defaultClientFiscalData;
  }
};

// Update fiscal data for a client
export const updateFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<boolean> => {
  try {
    // Update fiscal data in database
    const { error } = await supabase
      .from('clients')
      .update({ 
        fiscal_data: fiscalData 
      })
      .eq('id', clientId);

    if (error) {
      console.error("Error updating fiscal data:", error);
      return false;
    }

    // Update cache
    updateCache(clientId, fiscalData);

    return true;
  } catch (error) {
    console.error("Error updating fiscal data:", error);
    return false;
  }
};

// Alias for getFiscalData to maintain compatibility
export const fetchFiscalData = getFiscalData;

// Alias for updateFiscalData to maintain compatibility
export const saveFiscalData = updateFiscalData;
