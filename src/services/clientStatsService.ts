
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
      const fiscalData = client.fiscal_data as { obligations?: any };
      if (fiscalData.obligations?.patente) {
        return fiscalData.obligations.patente.assujetti === true && 
               fiscalData.obligations.patente.paye === false;
      }
    }
    return false;
  }).length;
  
  // Clients avec IGS impayé
  const unpaidIgsClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as { obligations?: any };
      if (fiscalData.obligations?.igs) {
        return fiscalData.obligations.igs.assujetti === true && 
               fiscalData.obligations.igs.paye === false;
      }
    }
    return false;
  }).length;

  // Clients avec DSF non déposée
  const unfiledDsfClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as { obligations?: any };
      if (fiscalData.obligations?.dsf) {
        return fiscalData.obligations.dsf.assujetti === true && 
               fiscalData.obligations.dsf.depose === false;
      }
    }
    return false;
  }).length;

  // Clients avec DARP non déposée
  const unfiledDarpClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as { obligations?: any };
      if (fiscalData.obligations?.darp) {
        return fiscalData.obligations.darp.assujetti === true && 
               fiscalData.obligations.darp.depose === false;
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
