
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec patentes impayées...");
  
  // Récupérer tous les clients
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  // Filtrer les clients avec patente impayée
  const clientsWithUnpaidPatente = allClients.filter(client => {
    // On vérifie si le client a des données fiscales
    if (client.fiscal_data && 
        typeof client.fiscal_data === 'object' && 
        client.fiscal_data !== null) {
      
      const fiscalData = client.fiscal_data as ClientFiscalData;
      
      // Ne pas inclure si explicitement marqué comme caché du tableau de bord
      if (fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      // Vérifier si obligations existe dans les données fiscales
      if (fiscalData.obligations) {
        // On cherche une obligation de type patente qui est assujetti mais non payée
        return fiscalData.obligations.patente && 
               fiscalData.obligations.patente.assujetti === true && 
               fiscalData.obligations.patente.paye === false;
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec patentes impayées:", clientsWithUnpaidPatente.length);
  
  return clientsWithUnpaidPatente as Client[];
};
