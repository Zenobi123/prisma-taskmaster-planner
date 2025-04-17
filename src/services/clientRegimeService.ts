
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
    // Vérifier si le client est au régime du réel
    if (client.regimefiscal === "reel") {
      reelClients++;
    }
    
    // Vérifier si le client est à l'IGS
    if (client.regimefiscal === "igs") {
      igsClients++;
      
      // Vérifier si le client IGS a des retards de paiement
      if (client.fiscal_data && typeof client.fiscal_data === 'object' && client.fiscal_data !== null) {
        const fiscalData = client.fiscal_data as { igs?: any };
        
        // Vérifier s'il y a des paiements IGS en retard
        if (fiscalData.igs) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          
          // Vérifier si nous sommes après janvier mais qu'aucun acompte n'a été payé
          if (currentMonth > 0 && (!fiscalData.igs.acompteJanvier || !fiscalData.igs.acompteJanvier.montant)) {
            delayedIgsClients++;
          }
          // Vérifier si nous sommes après février mais que l'acompte de février n'a pas été payé
          else if (currentMonth > 1 && (!fiscalData.igs.acompteFevrier || !fiscalData.igs.acompteFevrier.montant)) {
            delayedIgsClients++;
          }
        }
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
