
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
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
  
  return clientsWithUnpaidPatente.map(client => ({
    ...client,
    type: client.type as Client['type'],
    formejuridique: (client.formejuridique || 'autre') as Client['formejuridique'],
    adresse: client.adresse as Client['adresse'],
    contact: client.contact as Client['contact'],
    interactions: client.interactions as unknown as Client['interactions'],
    fiscal_data: client.fiscal_data as unknown as Client['fiscal_data'],
    statut: client.statut as Client['statut'],
    sexe: client.sexe as Client['sexe']
  }));
};
