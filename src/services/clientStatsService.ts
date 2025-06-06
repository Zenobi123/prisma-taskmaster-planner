
import { supabase } from "@/integrations/supabase/client";
import { getClientsWithUnpaidIgs, getClientsWithUnpaidPatente, getClientsWithUnfiledDsf, getClientsWithUnfiledDarp } from "./fiscalObligationsService";

export interface ClientStats {
  managedClients: number;
  fanrH2Clients: number;
  unpaidIgsClients: number;
  unpaidPatenteClients: number;
  unfiledDsfClients: number;
  unfiledDarpClients: number;
}

export const getClientsStats = async (): Promise<ClientStats> => {
  try {
    // Get all active clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return {
        managedClients: 0,
        fanrH2Clients: 0,
        unpaidIgsClients: 0,
        unpaidPatenteClients: 0,
        unfiledDsfClients: 0,
        unfiledDarpClients: 0
      };
    }

    const managedClients = clients?.length || 0;
    const fanrH2Clients = clients?.filter(client => client.inscriptionfanrharmony2 === true).length || 0;

    // Get fiscal obligations data
    const [unpaidIgsClients, unpaidPatenteClients, unfiledDsfClients, unfiledDarpClients] = await Promise.all([
      getClientsWithUnpaidIgs(),
      getClientsWithUnpaidPatente(),
      getClientsWithUnfiledDsf(),
      getClientsWithUnfiledDarp()
    ]);

    return {
      managedClients,
      fanrH2Clients,
      unpaidIgsClients: unpaidIgsClients.length,
      unpaidPatenteClients: unpaidPatenteClients.length,
      unfiledDsfClients: unfiledDsfClients.length,
      unfiledDarpClients: unfiledDarpClients.length
    };
  } catch (error) {
    console.error('Error in getClientsStats:', error);
    return {
      managedClients: 0,
      fanrH2Clients: 0,
      unpaidIgsClients: 0,
      unpaidPatenteClients: 0,
      unfiledDsfClients: 0,
      unfiledDarpClients: 0
    };
  }
};
