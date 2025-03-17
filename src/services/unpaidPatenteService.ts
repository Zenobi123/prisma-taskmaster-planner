
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType } from "@/types/client";

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  console.log("Récupération des clients avec patentes impayées...");
  
  // Récupérer tous les clients
  const { data: allClients, error: clientsError } = await supabase
    .from("clients")
    .select("*");
  
  if (clientsError) {
    console.error("Erreur lors de la récupération des clients:", clientsError);
    throw clientsError;
  }

  // Filtrer les clients qui ont une patente impayée
  const clientsWithUnpaidPatente = allClients.filter(client => {
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
  });
  
  console.log("Clients avec patentes impayées:", clientsWithUnpaidPatente.length);
  
  // Convertir les données brutes en objets Client typés
  const typedClients: Client[] = clientsWithUnpaidPatente.map(client => ({
    ...client,
    // Assurer que type est correctement typé comme ClientType
    type: client.type as ClientType,
    // Assurer que les autres champs correspondent au type Client
    adresse: client.adresse,
    contact: client.contact,
    interactions: client.interactions || [],
    statut: client.statut as any, // Conversion de statut en ClientStatus
    // Ajout d'autres conversions si nécessaire
  }));
  
  return typedClients;
};
