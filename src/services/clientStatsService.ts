
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
  
  // Clients assujettis à l'IGS qui ne l'ont pas payé
  const unpaidPatenteClients = allClients.filter(client => {
    // Vérifier si c'est un client IGS
    if (client.regimefiscal === "igs") {
      console.log(`Analyse du client IGS ${client.id} pour statistiques`);
      
      // Vérifier directement les données IGS dans l'objet client.igs
      if (client.igs) {
        console.log(`Données IGS pour client ${client.id}:`, client.igs);
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        
        // Vérifier si nous sommes après janvier mais qu'aucun acompte n'a été payé
        if (currentMonth > 0 && (!client.igs.acompteJanvier || !client.igs.acompteJanvier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de janvier - ajouté aux statistiques`);
          return true;
        }
        // Vérifier si nous sommes après février mais que l'acompte de février n'a pas été payé
        else if (currentMonth > 1 && (!client.igs.acompteFevrier || !client.igs.acompteFevrier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de février - ajouté aux statistiques`);
          return true;
        }
      } else {
        console.log(`Client ${client.id} est IGS mais sans données IGS définies - ajouté aux statistiques`);
        return true; // Si le client est IGS mais n'a pas de données IGS, on le considère en retard
      }
    }
    return false;
  }).length;
  
  // Clients avec DSF non déposée (gardons cette partie inchangée)
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
