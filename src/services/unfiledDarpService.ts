
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export async function getClientsWithUnfiledDarp(): Promise<Client[]> {
  try {
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .not('fiscal_data', 'is', null);

    if (error) throw error;

    // Convert data to Client[] and filter
    const clients = clientsData as Client[];
    
    // Current year for consistency
    const currentYear = new Date().getFullYear().toString();
    
    // Filter clients with unfiled DARP
    return clients.filter(client => {
      if (!client.fiscal_data || typeof client.fiscal_data !== 'object') return false;
      
      const fiscalData = client.fiscal_data;
      if (!fiscalData.obligations || !fiscalData.obligations[currentYear]) return false;
      
      const obligations = fiscalData.obligations[currentYear];
      return obligations.darp && obligations.darp.assujetti === true && obligations.darp.soumis === false;
    });
  } catch (error) {
    console.error('Error fetching clients with unfiled DARP:', error);
    return [];
  }
}
