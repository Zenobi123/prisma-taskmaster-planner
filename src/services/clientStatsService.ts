
import { supabase } from "@/integrations/supabase/client";

export const getClientStats = async () => {
  console.log("Récupération des statistiques clients...");
  
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
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as Record<string, any>;
      if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
        const obligations = fiscalData.obligations as Record<string, any>;
        return obligations.patente?.assujetti === true && 
               obligations.patente?.paye === false;
      }
    }
    return false;
  }).length;
  
  // Clients avec IGS impayé
  const unpaidIgsClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as Record<string, any>;
      if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
        const obligations = fiscalData.obligations as Record<string, any>;
        return obligations.igs?.assujetti === true && 
               obligations.igs?.paye === false;
      }
    }
    return false;
  }).length;

  // Clients avec DSF non déposée
  const unfiledDsfClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as Record<string, any>;
      if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
        const obligations = fiscalData.obligations as Record<string, any>;
        return obligations.dsf?.assujetti === true && 
               obligations.dsf?.depose === false;
      }
    }
    return false;
  }).length;

  // Clients avec DARP non déposée
  const unfiledDarpClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as Record<string, any>;
      if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
        const obligations = fiscalData.obligations as Record<string, any>;
        return obligations.darp?.assujetti === true && 
               obligations.darp?.depose === false;
      }
    }
    return false;
  }).length;
  
  console.log("Statistiques clients:", { managedClients, unpaidPatenteClients, unpaidIgsClients, unfiledDsfClients, unfiledDarpClients });
  
  return {
    managedClients,
    unpaidPatenteClients,
    unpaidIgsClients,
    unfiledDsfClients,
    unfiledDarpClients
  };
};
