
import { supabase } from "@/integrations/supabase/client";
import { getClientsWithUnpaidIgs } from "./fiscal/unpaidIgsService";
import { getClientsWithUnpaidPatente } from "./fiscal/unpaidPatenteService";
import { getClientsWithUnfiledDsf } from "./fiscal/unfiledDsfService";
import { getClientsWithUnfiledDarp } from "./fiscal/unfiledDarpService";
import { getClientsWithNonCompliantFiscalSituation } from "./fiscal/nonCompliantFiscalService";

export interface ClientStats {
  managedClients: number;
  unpaidIgsClients: number;
  unpaidPatenteClients: number;
  unfiledDsfClients: number;
  unfiledDarpClients: number;
  nonCompliantClients: number;
}

export const getClientsStats = async (): Promise<ClientStats> => {
  try {
    console.log("📊 Getting client stats...");
    
    // Get all active clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('❌ Error fetching clients:', error);
      return {
        managedClients: 0,
        unpaidIgsClients: 0,
        unpaidPatenteClients: 0,
        unfiledDsfClients: 0,
        unfiledDarpClients: 0,
        nonCompliantClients: 0
      };
    }

    const managedClients = clients?.length || 0;

    console.log(`📈 Found ${managedClients} managed clients`);

    // Get fiscal obligations data using the centralized services
    const [unpaidIgsClients, unpaidPatenteClients, unfiledDsfClients, unfiledDarpClients, nonCompliantClients] = await Promise.all([
      getClientsWithUnpaidIgs().catch(err => {
        console.error('❌ Error getting unpaid IGS clients:', err);
        return [];
      }),
      getClientsWithUnpaidPatente().catch(err => {
        console.error('❌ Error getting unpaid patente clients:', err);
        return [];
      }),
      getClientsWithUnfiledDsf().catch(err => {
        console.error('❌ Error getting unfiled DSF clients:', err);
        return [];
      }),
      getClientsWithUnfiledDarp().catch(err => {
        console.error('❌ Error getting unfiled DARP clients:', err);
        return [];
      }),
      getClientsWithNonCompliantFiscalSituation().catch(err => {
        console.error('❌ Error getting non-compliant clients:', err);
        return [];
      })
    ]);

    const stats = {
      managedClients,
      unpaidIgsClients: unpaidIgsClients.length,
      unpaidPatenteClients: unpaidPatenteClients.length,
      unfiledDsfClients: unfiledDsfClients.length,
      unfiledDarpClients: unfiledDarpClients.length,
      nonCompliantClients: nonCompliantClients.length
    };

    console.log("📊 Final client stats:", stats);

    return stats;
  } catch (error) {
    console.error('❌ Error in getClientsStats:', error);
    return {
      managedClients: 0,
      unpaidIgsClients: 0,
      unpaidPatenteClients: 0,
      unfiledDsfClients: 0,
      unfiledDarpClients: 0,
      nonCompliantClients: 0
    };
  }
};
