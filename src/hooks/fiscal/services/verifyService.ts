
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";

/**
 * Verify that fiscal data was saved correctly
 */
export const verifyFiscalDataSave = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  try {
    console.log(`Verifying fiscal data save for client ${clientId}`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error during save verification:", error);
      return false;
    }
    
    if (data?.fiscal_data) {
      const savedData = data.fiscal_data as ClientFiscalData;
      
      // Check essential fields match
      const keysToCheck = ['hiddenFromDashboard', 'attestation', 'obligations'];
      for (const key of keysToCheck) {
        if (JSON.stringify(savedData[key as keyof ClientFiscalData]) !== 
            JSON.stringify(expectedData[key as keyof ClientFiscalData])) {
          console.error(`Mismatch in ${key} field`);
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Exception during save verification:", error);
    return false;
  }
};
