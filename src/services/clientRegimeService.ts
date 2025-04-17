
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

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
      console.log(`Client IGS détecté: ${client.id}`);
      igsClients++;
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Vérifier les données IGS
      if (typedClient.igs) {
        const igsData = typedClient.igs;
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
      } else if (client.fiscal_data) {
        // Alternatively, try to get IGS data from fiscal_data
        const fiscalData = client.fiscal_data as any;
        if (fiscalData.igs) {
          const igsData = fiscalData.igs;
          
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
            console.log(`Client ${client.id} en retard pour l'acompte de janvier (via fiscal_data)`);
            delayedIgsClients++;
          } else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
            console.log(`Client ${client.id} en retard pour l'acompte de février (via fiscal_data)`);
            delayedIgsClients++;
          }
        } else {
          console.log(`Client ${client.id} est IGS mais sans données IGS définies`);
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
