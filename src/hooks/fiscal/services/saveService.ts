
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { storeFiscalDataInCache } from "./cacheService";

export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData as any })
      .eq('id', clientId);

    if (error) {
      console.error('Error saving fiscal data:', error);
      return false;
    }

    // Update cache with new data
    storeFiscalDataInCache(clientId, fiscalData);
    return true;
  } catch (error) {
    console.error('Error in saveFiscalData:', error);
    return false;
  }
};

// Adding the alias function for backward compatibility
export const saveClientFiscalData = saveFiscalData;
