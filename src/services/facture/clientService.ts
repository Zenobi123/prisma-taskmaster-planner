
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère les données d'un client depuis la base de données
 */
export const getClientData = async (clientId: string) => {
  try {
    console.log(`Fetching client data for client ${clientId}`);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (error) {
      console.error(`Error fetching client ${clientId}:`, error);
      throw new Error("Client non trouvé");
    }
    
    console.log(`Successfully fetched client ${clientId}`);
    return data;
  } catch (error) {
    console.error(`Exception in getClientData for client ${clientId}:`, error);
    throw error;
  }
};
