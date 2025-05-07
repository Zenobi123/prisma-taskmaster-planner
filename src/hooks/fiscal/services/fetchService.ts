
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { getFiscalDataFromCache, storeFiscalDataInCache } from "./cacheService";

export const getClientFiscalData = async (clientId: string): Promise<ClientFiscalData | null> => {
  try {
    // Try to get from cache first
    const cachedData = getFiscalDataFromCache(clientId);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from database
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error('Error fetching fiscal data:', error);
      return null;
    }

    const fiscalData = data?.fiscal_data as ClientFiscalData || null;
    
    // Store in cache for future use
    if (fiscalData) {
      storeFiscalDataInCache(clientId, fiscalData);
    }

    return fiscalData;
  } catch (error) {
    console.error('Error in getClientFiscalData:', error);
    return null;
  }
};
