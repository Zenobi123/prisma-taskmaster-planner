
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique, Sexe, EtatCivil } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

// Cache for Patente data
let patenteCache: {
  data: Client[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Cache duration in milliseconds (30 seconds)
const CACHE_DURATION = 30000;

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  const now = Date.now();
  
  // Return cached data if valid
  if (patenteCache.data && now - patenteCache.timestamp < CACHE_DURATION) {
    console.log("Using cached Patente data");
    return patenteCache.data;
  }
  
  console.log("Service: Récupération des clients avec patentes impayées...");
  
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  const clientsWithUnpaidPatente = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as unknown as ClientFiscalData;
      
      if (fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      if (fiscalData.obligations?.patente) {
        return fiscalData.obligations.patente.assujetti === true && 
               fiscalData.obligations.patente.paye === false;
      }
    }
    return false;
  });
  
  // Convert to client type with proper type casting
  const typedClients = clientsWithUnpaidPatente.map(client => {
    return {
      ...client,
      type: client.type as ClientType,
      formejuridique: (client.formejuridique || 'autre') as FormeJuridique,
      sexe: client.sexe as Sexe,
      etatcivil: client.etatcivil as EtatCivil,
      adresse: client.adresse as Client['adresse'],
      contact: client.contact as Client['contact'],
      interactions: client.interactions as unknown as Client['interactions'],
      fiscal_data: client.fiscal_data as unknown as Client['fiscal_data'],
      statut: client.statut as Client['statut']
    } as Client;
  });

  // Update cache
  patenteCache = {
    data: typedClients,
    timestamp: now
  };
  
  return typedClients;
};
