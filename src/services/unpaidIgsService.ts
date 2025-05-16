
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export async function getClientsWithUnpaidIgs(): Promise<Client[]> {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .not('fiscal_data', 'is', null);

    if (error) throw error;

    // Filter clients with unpaid IGS
    return clients.filter(client => {
      const fiscalData = client.fiscal_data;
      if (!fiscalData) return false;
      
      // Get current year
      const currentYear = new Date().getFullYear().toString();
      
      // Check if client has fiscal data for current year
      if (!fiscalData.obligations || !fiscalData.obligations[currentYear]) return false;
      
      // Get IGS obligation status
      const igsStatus = fiscalData.obligations[currentYear]?.igs;
      
      // Return true if IGS is required but not paid
      return igsStatus && igsStatus.assujetti === true && igsStatus.paye === false;
    }) as Client[];
  } catch (error) {
    console.error('Error fetching clients with unpaid IGS:', error);
    return [];
  }
}
