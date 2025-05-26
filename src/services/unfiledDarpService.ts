
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

    // Convertir les données en Client[] et filtrer
    const clients = clientsData.map(client => client as unknown as Client);
    
    // Filter clients with unfiled DARP
    return clients.filter(client => {
      const fiscalData = client.fiscal_data;
      if (!fiscalData) return false;
      
      // Get current year
      const currentYear = new Date().getFullYear().toString();
      
      // Vérifier que fiscal_data est un objet et contient obligations
      if (typeof fiscalData !== 'object' || !fiscalData.obligations) return false;
      
      // Vérifier que l'année courante existe dans obligations
      if (!fiscalData.obligations[currentYear]) return false;
      
      // Get DARP obligation status
      const darpStatus = fiscalData.obligations[currentYear]?.darp;
      
      // Return true if DARP is required but not filed
      return darpStatus && darpStatus.assujetti === true && darpStatus.depose === false;
    });
  } catch (error) {
    console.error('Error fetching clients with unfiled DARP:', error);
    return [];
  }
}
