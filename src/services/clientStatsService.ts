
import { supabase } from "@/integrations/supabase/client";

export const getClientsStats = async () => {
  try {
    console.log("Récupération des statistiques clients...");
    
    // Get all active clients
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .eq("statut", "actif");

    if (clientsError) {
      console.error("Erreur lors de la récupération des clients:", clientsError);
      throw clientsError;
    }

    console.log("Clients récupérés:", clients?.length || 0);

    // Count managed clients
    const managedClients = clients?.filter(client => client.gestionexternalisee).length || 0;

    // Count FANR H2 inscribed clients
    const fanrH2Clients = clients?.filter(client => client.inscriptionfanrharmony2).length || 0;

    // Get unfiled DSF clients count from fiscal_obligations
    const { data: unfiledDsf, error: dsfError } = await supabase
      .from('fiscal_obligations')
      .select('client_id')
      .eq('type_obligation', 'dsf')
      .eq('depose', false);

    const unfiledDsfClients = unfiledDsf?.length || 0;

    // Get unpaid patente clients count
    const { data: unpaidPatente, error: patenteError } = await supabase
      .from('fiscal_obligations')
      .select('client_id')
      .eq('type_obligation', 'patente')
      .eq('paye', false);

    const unpaidPatenteClients = unpaidPatente?.length || 0;

    // Get unpaid IGS clients count
    const { data: unpaidIgs, error: igsError } = await supabase
      .from('fiscal_obligations')
      .select('client_id')
      .eq('type_obligation', 'igs')
      .eq('paye', false);

    const unpaidIgsClients = unpaidIgs?.length || 0;

    // Get unfiled DARP clients count
    const { data: unfiledDarp, error: darpError } = await supabase
      .from('fiscal_obligations')
      .select('client_id')
      .eq('type_obligation', 'darp')
      .eq('depose', false);

    const unfiledDarpClients = unfiledDarp?.length || 0;

    return {
      managedClients,
      fanrH2Clients,
      unfiledDsfClients,
      unpaidPatenteClients,
      unpaidIgsClients,
      unfiledDarpClients
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    throw error;
  }
};
