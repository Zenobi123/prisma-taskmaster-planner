
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { Json } from "@/integrations/supabase/types";

/**
 * Fetch fiscal data with retry capability
 */
export const fetchFiscalData = async (clientId: string, retryCount = 0): Promise<ClientFiscalData | null> => {
  try {
    console.log(`Fetching fiscal data for client ${clientId} (attempt ${retryCount + 1})`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error(`Error fetching fiscal data (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFiscalData(clientId, retryCount + 1);
      }
      
      return null;
    }
    
    if (data?.fiscal_data) {
      // Conversion sécurisée en utilisant unknown comme intermédiaire
      const fiscalData = data.fiscal_data as unknown as ClientFiscalData;
      return fiscalData;
    }
    
    return null;
  } catch (error) {
    console.error(`Exception during fiscal data fetch (attempt ${retryCount + 1}):`, error);
    return null;
  }
};
