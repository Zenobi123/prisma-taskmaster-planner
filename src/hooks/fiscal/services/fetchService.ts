
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, ObligationStatuses } from "../types";
import { Json } from "@/integrations/supabase/types";
import { validateAndMigrateFiscalData } from "./validationService";

/**
 * Fetch fiscal data with retry capability and automatic validation/migration
 */
export const fetchFiscalData = async (clientId: string, retryCount = 0): Promise<ClientFiscalData | null> => {
  try {
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFiscalData(clientId, retryCount + 1);
      }
      
      return null;
    }
    
    if (data?.fiscal_data) {
      // Conversion sécurisée en utilisant unknown comme intermédiaire
      const rawFiscalData = data.fiscal_data as unknown as any;
      
      // Validation et migration automatique des données
      const validatedData = validateAndMigrateFiscalData(rawFiscalData);
      
      const fiscalData: ClientFiscalData = {
        clientId,
        year: validatedData.year,
        attestation: validatedData.attestation,
        obligations: validatedData.obligations,
        hiddenFromDashboard: validatedData.hiddenFromDashboard,
        selectedYear: validatedData.selectedYear,
        updatedAt: validatedData.updatedAt
      };
      
      return fiscalData;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
