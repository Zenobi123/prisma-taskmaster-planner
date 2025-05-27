
import { supabase } from "@/integrations/supabase/client";
import { validateAndMigrateObligationStatuses } from "@/hooks/fiscal/services/validationService";

export const getClientStats = async () => {
  console.log("Récupération des statistiques clients...");
  
  const { data: allClients, error: clientsError } = await supabase
    .from("clients")
    .select("*");
  
  if (clientsError) {
    console.error("Erreur lors de la récupération des clients:", clientsError);
    throw clientsError;
  }

  console.log(`Nombre total de clients récupérés: ${allClients.length}`);

  // Obtenir l'année fiscale courante
  const currentYear = new Date().getFullYear().toString();
  console.log(`Année fiscale courante utilisée pour les statistiques: ${currentYear}`);

  // Nombre total de clients en gestion
  const managedClients = allClients.filter(client => client.gestionexternalisee === true).length;
  console.log(`Clients en gestion externe: ${managedClients}`);
  
  // Initialiser les compteurs pour les statistiques
  let unpaidPatenteClients = 0;
  let unpaidIgsClients = 0;
  let unfiledDsfClients = 0;
  let unfiledDarpClients = 0;

  // Compteurs de débogage
  let clientsWithFiscalData = 0;
  let clientsWithObligationsForCurrentYear = 0;

  // Analyser chaque client
  allClients.forEach(client => {
    if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
      return; // Ignorer les clients sans données fiscales
    }

    clientsWithFiscalData++;
    const fiscalData = client.fiscal_data as Record<string, any>;
    
    // Vérifier si les obligations existent pour l'année courante
    if (!fiscalData.obligations || typeof fiscalData.obligations !== 'object') {
      console.log(`Client ${client.id}: Pas d'obligations dans fiscal_data`);
      return;
    }

    const yearObligations = fiscalData.obligations[currentYear];
    if (!yearObligations) {
      console.log(`Client ${client.id}: Pas d'obligations pour l'année ${currentYear}`);
      return;
    }

    clientsWithObligationsForCurrentYear++;

    // Valider et migrer les obligations pour obtenir une structure unifiée
    const validatedObligations = validateAndMigrateObligationStatuses(yearObligations);
    
    // Clients assujettis à la patente qui ne l'ont pas payée
    const patenteStatus = validatedObligations.patente;
    if (patenteStatus && 'payee' in patenteStatus && patenteStatus.assujetti === true && patenteStatus.payee === false) {
      unpaidPatenteClients++;
      console.log(`Client ${client.id}: Patente impayée détectée`);
    }
    
    // Clients avec IGS impayé
    const igsStatus = validatedObligations.igs;
    if (igsStatus && 'payee' in igsStatus && igsStatus.assujetti === true && igsStatus.payee === false) {
      unpaidIgsClients++;
      console.log(`Client ${client.id}: IGS impayé détecté`);
    }

    // Clients avec DSF non déposée
    const dsfStatus = validatedObligations.dsf;
    if (dsfStatus && 'depose' in dsfStatus && dsfStatus.assujetti === true && dsfStatus.depose === false) {
      unfiledDsfClients++;
      console.log(`Client ${client.id}: DSF non déposée détectée`);
    }

    // Clients avec DARP non déposée
    const darpStatus = validatedObligations.darp;
    if (darpStatus && 'depose' in darpStatus && darpStatus.assujetti === true && darpStatus.depose === false) {
      unfiledDarpClients++;
      console.log(`Client ${client.id}: DARP non déposée détectée`);
    }
  });

  // Logs de débogage finaux
  console.log("=== STATISTIQUES DE TRAITEMENT ===");
  console.log(`Clients avec données fiscales: ${clientsWithFiscalData}`);
  console.log(`Clients avec obligations pour ${currentYear}: ${clientsWithObligationsForCurrentYear}`);
  console.log("=== RÉSULTATS FINAUX ===");
  console.log(`Clients en gestion: ${managedClients}`);
  console.log(`Patentes impayées: ${unpaidPatenteClients}`);
  console.log(`IGS impayés: ${unpaidIgsClients}`);
  console.log(`DSF non déposées: ${unfiledDsfClients}`);
  console.log(`DARP non déposées: ${unfiledDarpClients}`);
  
  return {
    managedClients,
    unpaidPatenteClients,
    unpaidIgsClients,
    unfiledDsfClients,
    unfiledDarpClients
  };
};
