
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
    
    // Filter clients with unfiled DSF
    return clients.filter(client => {
      const fiscalData = client.fiscal_data;
      if (!fiscalData) return false;
      
      // Get current year
      const currentYear = new Date().getFullYear().toString();
      
      // Vérifier que fiscal_data est un objet et contient obligations
      if (typeof fiscalData !== 'object' || !fiscalData.obligations) return false;
      
      // Vérifier que l'année courante existe dans obligations
      if (!fiscalData.obligations[currentYear]) return false;
      
      // Get DSF obligation status
      const dsfStatus = fiscalData.obligations[currentYear]?.dsf;
      
      // Return true if DSF is required but not filed
      return dsfStatus && dsfStatus.assujetti === true && dsfStatus.depose === false;
    });
  } catch (error) {
    console.error('Error fetching clients with unfiled DSF:', error);
    return [];
  }
}
