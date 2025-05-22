
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

  // Année courante pour la cohérence entre modules
  const currentYear = new Date().getFullYear().toString();

  // Nombre total de clients en gestion
  const managedClients = allClients.filter(client => client.gestionexternalisee === true).length;
  
  // Clients assujettis à la patente qui ne l'ont pas payée
  const unpaidPatenteClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data;
      if (fiscalData.obligations && fiscalData.obligations[currentYear]) {
        const obligations = fiscalData.obligations[currentYear];
        return obligations.patente && obligations.patente.assujetti === true && 
               obligations.patente.payee === false;
      }
    }
    return false;
  }).length;
  
  // Clients avec IGS impayé
  const unpaidIgsClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data;
      if (fiscalData.obligations && fiscalData.obligations[currentYear]) {
        const obligations = fiscalData.obligations[currentYear];
        return obligations.igs && obligations.igs.assujetti === true && 
               obligations.igs.payee === false;
      }
    }
    return false;
  }).length;

  // Clients avec DSF non déposée
  const unfiledDsfClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data;
      if (fiscalData.obligations && fiscalData.obligations[currentYear]) {
        const obligations = fiscalData.obligations[currentYear];
        return obligations.dsf && obligations.dsf.assujetti === true && 
               obligations.dsf.soumis === false;
      }
    }
    return false;
  }).length;

  // Clients avec DARP non déposée
  const unfiledDarpClients = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data;
      if (fiscalData.obligations && fiscalData.obligations[currentYear]) {
        const obligations = fiscalData.obligations[currentYear];
        return obligations.darp && obligations.darp.assujetti === true && 
               obligations.darp.soumis === false;
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
