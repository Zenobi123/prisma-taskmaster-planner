
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";

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
      // Cast the data to ClientFiscalData type with proper type assertion
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
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<void> => {
  try {
    console.log(`Saving fiscal data for client ${clientId}`, fiscalData);
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData })
      .eq('id', clientId);
    
    if (error) {
      console.error("Error saving fiscal data:", error);
      throw error;
    }
    
    console.log(`Fiscal data saved for client ${clientId}`);
    
    // Invalidate related queries to refresh dashboard data
    await invalidateRelatedQueries();
    
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
    // This is just a placeholder since we can't directly access React Query's queryClient
    // In a real app, we would need to somehow trigger a refresh of related queries
    console.log("Related queries should be invalidated");
    
    // One option is to add a timestamp to a table that other components can watch
    // Another option is to use a pub/sub mechanism or websockets
    
  } catch (error) {
    console.error("Error invalidating related queries:", error);
  }
};
