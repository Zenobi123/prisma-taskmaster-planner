
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec DSF non déposées...");
  
  // Récupérer tous les clients
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  console.log("Service: Nombre total de clients récupérés:", allClients.length);
  
  // Filtrer les clients avec DSF non déposée
  const clientsWithUnfiledDsf = allClients.filter(client => {
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
        // On cherche une obligation de type dsf qui est assujetti mais non déposée
        return fiscalData.obligations.dsf && 
               fiscalData.obligations.dsf.assujetti === true && 
               fiscalData.obligations.dsf.depose === false;
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec DSF non déposées:", clientsWithUnfiledDsf.length);
  
  if (clientsWithUnfiledDsf.length > 0) {
    console.log("Service: Premier client avec DSF non déposée:", clientsWithUnfiledDsf[0]);
  }
  
  // Convert to proper Client type
  return clientsWithUnfiledDsf.map(client => ({
    ...client,
    type: client.type as ClientType,
    adresse: client.adresse || { ville: "", quartier: "", lieuDit: "" },
    contact: client.contact || { telephone: "", email: "" },
    interactions: Array.isArray(client.interactions) ? client.interactions : [],
    statut: client.statut || "actif",
    gestionexternalisee: client.gestionexternalisee || false
  }));
};
