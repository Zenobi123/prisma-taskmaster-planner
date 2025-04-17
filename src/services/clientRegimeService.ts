
import { supabase } from "@/integrations/supabase/client";

export interface ClientRegimeStats {
  reelClients: number;
  igsClients: number;
  delayedIgsClients: number;
}

export const getClientsRegimeStats = async (): Promise<ClientRegimeStats> => {
  console.log("Récupération des statistiques des régimes fiscaux...");
  
  // Récupérer tous les clients
  const { data: allClients, error: clientsError } = await supabase
    .from("clients")
    .select("*");
  
  if (clientsError) {
    console.error("Erreur lors de la récupération des clients:", clientsError);
    throw clientsError;
  }

  // Compter les clients par régime fiscal
  let reelClients = 0;
  let igsClients = 0;
  let delayedIgsClients = 0;

  allClients.forEach(client => {
    console.log(`Analyse du client ${client.id} - régime fiscal: ${client.regimefiscal}`);
    
    // Vérifier si le client est au régime du réel
    if (client.regimefiscal === "reel") {
      reelClients++;
    }
    
    // Vérifier si le client est à l'IGS
    if (client.regimefiscal === "igs") {
      console.log(`Client IGS détecté: ${client.id}, données IGS:`, client.igs);
      igsClients++;
      
      // Vérifier les données IGS directement dans l'objet client.igs
      if (client.igs) {
        const igsData = client.igs;
        console.log(`Données IGS pour client ${client.id}:`, igsData);
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        
        // Vérifier si nous sommes après janvier mais qu'aucun acompte n'a été payé
        if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
          console.log(`Client ${client.id} en retard pour l'acompte de janvier`);
          delayedIgsClients++;
        }
        // Vérifier si nous sommes après février mais que l'acompte de février n'a pas été payé
        else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
          console.log(`Client ${client.id} en retard pour l'acompte de février`);
          delayedIgsClients++;
        }
      } else {
        console.log(`Client ${client.id} est IGS mais sans données IGS définies`);
      }
    }
  });
  
  console.log("Statistiques des régimes fiscaux:", { reelClients, igsClients, delayedIgsClients });
  
  return {
    reelClients,
    igsClients,
    delayedIgsClients
  };
};
