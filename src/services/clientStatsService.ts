
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
    if (client.fiscal_data && client.fiscal_data.obligations) {
      const obligations = client.fiscal_data.obligations;
      
      // On cherche une obligation de type patente qui est due mais non payée
      return obligations.some((obligation: any) => 
        obligation.type === 'patente' && 
        obligation.status === 'due' && 
        !obligation.paid
      );
    }
    return false;
  }).length;
  
  console.log("Statistiques clients:", { managedClients, unpaidPatenteClients });
  
  return {
    managedClients,
    unpaidPatenteClients
  };
};
