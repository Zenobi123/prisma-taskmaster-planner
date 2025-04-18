
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

export const getClientsWithUnfiledDarp = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec DARP non déposées...");
  
  try {
    const { data: allClients, error } = await supabase
      .from("clients")
      .select("*");
    
    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    const clientsWithUnfiledDarp = allClients.filter(client => {
      if (client.fiscal_data && typeof client.fiscal_data === 'object') {
        const fiscalData = client.fiscal_data as ClientFiscalData;
        
        if (fiscalData.hiddenFromDashboard === true) {
          return false;
        }
        
        if (fiscalData.obligations?.darp) {
          return fiscalData.obligations.darp.assujetti === true && 
                 fiscalData.obligations.darp.depose === false;
        }
      }
      return false;
    });

    // Convert the Supabase result to proper Client type
    return clientsWithUnfiledDarp.map(client => {
      return {
        ...client,
        adresse: client.adresse as { ville: string; quartier: string; lieuDit: string },
        contact: client.contact as { telephone: string; email: string },
        fiscal_data: client.fiscal_data,
        interactions: client.interactions as any[] || [],
        gestionexternalisee: Boolean(client.gestionexternalisee)
      } as Client;
    });
  } catch (error) {
    console.error("Erreur critique lors de la récupération des clients DARP:", error);
    return [];
  }
};
