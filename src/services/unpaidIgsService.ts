
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

export const getClientsWithUnpaidIGS = async (): Promise<Client[]> => {
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
      const fiscalData = client.fiscal_data as ClientFiscalData;
      
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
  
  // Ensure proper type casting with all required Client properties
  return clientsWithUnpaidIGS.map(client => ({
    ...client,
    adresse: client.adresse as Client['adresse'],
    contact: client.contact as Client['contact'],
    interactions: client.interactions as Client['interactions'],
    fiscal_data: client.fiscal_data as Client['fiscal_data']
  }));
};
