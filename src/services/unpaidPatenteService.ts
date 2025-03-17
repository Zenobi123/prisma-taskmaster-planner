
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, ClientStatus, FormeJuridique, RegimeFiscal } from "@/types/client";

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
  
  // Convertir les données brutes en objets Client typés avec des conversions explicites pour tous les champs enum
  const typedClients: Client[] = clientsWithUnpaidPatente.map(client => ({
    ...client,
    type: client.type as ClientType,
    adresse: client.adresse,
    contact: client.contact,
    interactions: client.interactions || [],
    statut: client.statut as ClientStatus,
    formejuridique: client.formejuridique as FormeJuridique || undefined,
    regimefiscal: client.regimefiscal as RegimeFiscal || undefined,
    datecreation: client.datecreation || undefined,
    lieucreation: client.lieucreation || undefined,
    nomdirigeant: client.nomdirigeant || undefined,
    sigle: client.sigle || undefined,
    nom: client.nom || undefined,
    raisonsociale: client.raisonsociale || undefined,
    situationimmobiliere: client.situationimmobiliere || undefined
  }));
  
  return typedClients;
};
