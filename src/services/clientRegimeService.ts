
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { calculatePaymentStatus } from "@/components/clients/identity/igs/utils/igsCalculations";

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

  const currentDate = new Date();

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
      
      // Vérifier les données IGS - d'abord dans typedClient.igs
      if (typedClient.igs && typedClient.igs.soumisIGS) {
        const igsData = typedClient.igs;
        console.log(`Données IGS pour client ${client.id}:`, igsData);
        
        // Vérifier si caché du tableau de bord
        if (typedClient.fiscal_data?.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord`);
          return;
        }
        
        // Utiliser le nouveau système de suivi des paiements avec completedPayments
        if (Array.isArray(igsData.completedPayments)) {
          const paymentStatus = calculatePaymentStatus(igsData.completedPayments, currentDate);
          
          if (!paymentStatus.isUpToDate) {
            console.log(`Client ${client.id} en retard selon le système de suivi des paiements`);
            delayedIgsClients++;
          }
        } 
        // Fallback: vérifier les acomptes individuels si completedPayments n'est pas utilisé
        else {
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
            console.log(`Client ${client.id} en retard pour l'acompte de janvier`);
            delayedIgsClients++;
          }
          else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
            console.log(`Client ${client.id} en retard pour l'acompte de février`);
            delayedIgsClients++;
          }
        }
      } 
      // Chercher les données IGS dans fiscal_data si elles n'existent pas directement
      else if (client.fiscal_data) {
        const fiscalData = client.fiscal_data as any;
        
        // Vérifier si caché du tableau de bord
        if (fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord via fiscal_data`);
          return;
        }
        
        if (fiscalData.igs && fiscalData.igs.soumisIGS) {
          const igsData = fiscalData.igs;
          
          // Utiliser le nouveau système de suivi des paiements avec completedPayments
          if (Array.isArray(igsData.completedPayments)) {
            const paymentStatus = calculatePaymentStatus(igsData.completedPayments, currentDate);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} en retard selon le système de suivi des paiements (via fiscal_data)`);
              delayedIgsClients++;
            }
          }
          // Fallback: vérifier les acomptes individuels si completedPayments n'est pas utilisé
          else {
            const currentMonth = currentDate.getMonth();
            
            if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
              console.log(`Client ${client.id} en retard pour l'acompte de janvier (via fiscal_data)`);
              delayedIgsClients++;
            } else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
              console.log(`Client ${client.id} en retard pour l'acompte de février (via fiscal_data)`);
              delayedIgsClients++;
            }
          }
        } else {
          console.log(`Client ${client.id} est IGS mais sans données IGS définies dans fiscal_data`);
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
