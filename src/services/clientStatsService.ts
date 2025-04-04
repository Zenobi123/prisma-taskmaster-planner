
import { supabase } from "@/integrations/supabase/client";

export const getClientStats = async () => {
  console.log("Récupération des statistiques clients...");
  
  // Récupérer tous les clients
  const { data: allClients, error: clientsError } = await supabase
    .from("clients")
    .select("*");
  
  if (clientsError) {
    console.error("Erreur lors de la récupération des clients:", clientsError);
    throw clientsError;
  }

  // Nombre total de clients en gestion
  const managedClients = allClients.filter(client => client.gestionexternalisee === true).length;
  
  // Clients assujettis à la patente qui ne l'ont pas payée
  const unpaidPatenteClients = allClients.filter(client => {
    // On vérifie si le client a des données fiscales
    if (client.fiscal_data && typeof client.fiscal_data === 'object' && client.fiscal_data !== null) {
      // Vérifier si obligations existe dans les données fiscales
      const fiscalData = client.fiscal_data as { obligations?: any };
      if (fiscalData.obligations) {
        // On cherche une obligation de type patente qui est assujetti mais non payée
        return fiscalData.obligations.patente && 
               fiscalData.obligations.patente.assujetti === true && 
               fiscalData.obligations.patente.paye === false;
      }
    }
    return false;
  }).length;
  
  // Clients avec DSF non déposée
  const unfiledDsfClients = allClients.filter(client => {
    // On vérifie si le client a des données fiscales
    if (client.fiscal_data && typeof client.fiscal_data === 'object' && client.fiscal_data !== null) {
      // Vérifier si obligations existe dans les données fiscales
      const fiscalData = client.fiscal_data as { obligations?: any };
      if (fiscalData.obligations) {
        // On cherche une obligation de type dsf qui est assujetti mais non déposée
        return fiscalData.obligations.dsf && 
               fiscalData.obligations.dsf.assujetti === true && 
               fiscalData.obligations.dsf.depose === false;
      }
    }
    return false;
  }).length;
  
  console.log("Statistiques clients:", { managedClients, unpaidPatenteClients, unfiledDsfClients });
  
  return {
    managedClients,
    unpaidPatenteClients,
    unfiledDsfClients
  };
};
