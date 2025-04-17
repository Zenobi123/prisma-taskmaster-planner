
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique, Sexe, EtatCivil } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

// Cache for IGS data
let igsCache: {
  data: Client[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Cache duration in milliseconds (30 seconds)
const CACHE_DURATION = 30000;

export const getClientsWithUnpaidIGS = async (): Promise<Client[]> => {
  const now = Date.now();
  
  // Return cached data if valid
  if (igsCache.data && now - igsCache.timestamp < CACHE_DURATION) {
    console.log("Using cached IGS data");
    return igsCache.data;
  }
  
  console.log("Service: Récupération des clients avec IGS impayés...");
  
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  const clientsWithUnpaidIGS = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as unknown as ClientFiscalData;
      
      if (fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      if (fiscalData.obligations?.igs) {
        return fiscalData.obligations.igs.assujetti === true && 
               fiscalData.obligations.igs.paye === false;
      }
    }
    return false;
  });
  
  // Convert to client type with proper type casting
  const typedClients = clientsWithUnpaidIGS.map(client => {
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
  igsCache = {
    data: typedClients,
    timestamp: now
  };
  
  return typedClients;
};
