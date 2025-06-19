
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
    console.log("Getting client stats...");
    
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

    console.log(`Found ${managedClients} managed clients, ${fanrH2Clients} FANR H2 clients`);

    // Get fiscal obligations data using the updated services
    const [unpaidIgsClients, unpaidPatenteClients, unfiledDsfClients, unfiledDarpClients] = await Promise.all([
      getClientsWithUnpaidIgs().catch(err => {
        console.error('Error getting unpaid IGS clients:', err);
        return [];
      }),
      getClientsWithUnpaidPatente().catch(err => {
        console.error('Error getting unpaid patente clients:', err);
        return [];
      }),
      getClientsWithUnfiledDsf().catch(err => {
        console.error('Error getting unfiled DSF clients:', err);
        return [];
      }),
      getClientsWithUnfiledDarp().catch(err => {
        console.error('Error getting unfiled DARP clients:', err);
        return [];
      })
    ]);

    console.log("Client stats:", {
      unpaidIgsCount: unpaidIgsClients.length,
      unpaidPatenteCount: unpaidPatenteClients.length,
      unfiledDsfCount: unfiledDsfClients.length,
      unfiledDarpCount: unfiledDarpClients.length
    });

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
