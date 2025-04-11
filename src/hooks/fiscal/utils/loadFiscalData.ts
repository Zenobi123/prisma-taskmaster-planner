
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { FiscalData, IGSData } from "../types/igsTypes";

/**
 * Loads fiscal data for a client from the database
 */
export async function loadFiscalData(clientId: string): Promise<FiscalData | null> {
  if (!clientId) return null;
  
  try {
    console.log("Fetching fiscal data for client", clientId);
    
    const { data, error } = await supabase
      .from("clients")
      .select("fiscal_data")
      .eq("id", clientId)
      .single();
    
    if (error) {
      console.error("Error fetching fiscal data:", error);
      return null;
    }
    
    console.log("Fiscal data found for client", clientId);
    
    if (data?.fiscal_data && typeof data.fiscal_data === 'object' && !Array.isArray(data.fiscal_data)) {
      return data.fiscal_data as FiscalData;
    }
    
    return null;
  } catch (error) {
    console.error("Error in loadFiscalData:", error);
    return null;
  }
}

/**
 * Extract IGS data from either fiscal_data or direct client property
 */
export function extractIGSData(fiscalData: FiscalData | null, client: Client): IGSData {
  // Try to get IGS data from fiscal_data first
  if (fiscalData?.igs) {
    return fiscalData.igs;
  } 
  // Fallback to client's igs property
  else if (client.igs) {
    return {
      soumisIGS: client.igs.soumisIGS || false,
      adherentCGA: client.igs.adherentCGA || false,
      classeIGS: client.igs.classeIGS,
      patente: client.igs.patente,
      acompteJanvier: client.igs.acompteJanvier,
      acompteFevrier: client.igs.acompteFevrier
    };
  }
  
  // Default empty IGS data
  return {
    soumisIGS: false,
    adherentCGA: false
  };
}
