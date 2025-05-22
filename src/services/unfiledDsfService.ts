
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export async function getClientsWithUnfiledDsf(): Promise<Client[]> {
  try {
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .not('fiscal_data', 'is', null);

    if (error) throw error;

    // Convertir les données en Client[] et filtrer
    const clients = clientsData as unknown as Client[];
    
    // Année courante pour la cohérence
    const currentYear = new Date().getFullYear().toString();
    
    // Filter clients with unfiled DSF
    return clients.filter(client => {
      if (!client.fiscal_data || typeof client.fiscal_data !== 'object') return false;
      
      const fiscalData = client.fiscal_data;
      if (!fiscalData.obligations || !fiscalData.obligations[currentYear]) return false;
      
      const obligations = fiscalData.obligations[currentYear];
      return obligations.dsf && obligations.dsf.assujetti === true && obligations.dsf.soumis === false;
    });
  } catch (error) {
    console.error('Error fetching clients with unfiled DSF:', error);
    return [];
  }
}
