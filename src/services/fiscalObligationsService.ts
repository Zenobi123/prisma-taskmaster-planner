
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export interface FiscalObligationSummary {
  clientId: string;
  clientName: string;
  obligations: {
    igs: { assujetti: boolean; payee: boolean };
    patente: { assujetti: boolean; payee: boolean };
    dsf: { assujetti: boolean; depose: boolean };
    darp: { assujetti: boolean; depose: boolean };
  };
}

export async function getFiscalObligationsSummary(): Promise<FiscalObligationSummary[]> {
  try {
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .not('fiscal_data', 'is', null);

    if (error) throw error;

    const clients = clientsData as unknown as Client[];
    const currentYear = new Date().getFullYear().toString();
    
    return clients
      .map(client => {
        const fiscalData = client.fiscal_data;
        if (!fiscalData || typeof fiscalData !== 'object') return null;
        
        const obligations = fiscalData.obligations?.[currentYear];
        if (!obligations) return null;

        return {
          clientId: client.id,
          clientName: client.nom || client.raisonsociale || "Client sans nom",
          obligations: {
            igs: {
              assujetti: obligations.igs?.assujetti || false,
              payee: obligations.igs?.payee || false
            },
            patente: {
              assujetti: obligations.patente?.assujetti || false,
              payee: obligations.patente?.payee || false
            },
            dsf: {
              assujetti: obligations.dsf?.assujetti || false,
              depose: obligations.dsf?.depose || false
            },
            darp: {
              assujetti: obligations.darp?.assujetti || false,
              depose: obligations.darp?.depose || false
            }
          }
        };
      })
      .filter(Boolean) as FiscalObligationSummary[];
  } catch (error) {
    console.error('Error fetching fiscal obligations summary:', error);
    return [];
  }
}

export async function getClientsWithUnpaidIgs(): Promise<Client[]> {
  const summary = await getFiscalObligationsSummary();
  const unpaidIgsClients = summary.filter(
    item => item.obligations.igs.assujetti && !item.obligations.igs.payee
  );
  
  if (unpaidIgsClients.length === 0) return [];
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .in('id', unpaidIgsClients.map(item => item.clientId));
    
  if (error) {
    console.error('Error fetching unpaid IGS clients:', error);
    return [];
  }
  
  return clients as unknown as Client[];
}

export async function getClientsWithUnpaidPatente(): Promise<Client[]> {
  const summary = await getFiscalObligationsSummary();
  const unpaidPatenteClients = summary.filter(
    item => item.obligations.patente.assujetti && !item.obligations.patente.payee
  );
  
  if (unpaidPatenteClients.length === 0) return [];
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .in('id', unpaidPatenteClients.map(item => item.clientId));
    
  if (error) {
    console.error('Error fetching unpaid Patente clients:', error);
    return [];
  }
  
  return clients as unknown as Client[];
}

export async function getClientsWithUnfiledDsf(): Promise<Client[]> {
  const summary = await getFiscalObligationsSummary();
  const unfiledDsfClients = summary.filter(
    item => item.obligations.dsf.assujetti && !item.obligations.dsf.depose
  );
  
  if (unfiledDsfClients.length === 0) return [];
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .in('id', unfiledDsfClients.map(item => item.clientId));
    
  if (error) {
    console.error('Error fetching unfiled DSF clients:', error);
    return [];
  }
  
  return clients as unknown as Client[];
}

export async function getClientsWithUnfiledDarp(): Promise<Client[]> {
  const summary = await getFiscalObligationsSummary();
  const unfiledDarpClients = summary.filter(
    item => item.obligations.darp.assujetti && !item.obligations.darp.depose
  );
  
  if (unfiledDarpClients.length === 0) return [];
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .in('id', unfiledDarpClients.map(item => item.clientId));
    
  if (error) {
    console.error('Error fetching unfiled DARP clients:', error);
    return [];
  }
  
  return clients as unknown as Client[];
}
