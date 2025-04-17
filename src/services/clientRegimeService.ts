
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { calculatePaymentStatus } from "@/components/clients/identity/igs/utils/igsCalculations";

// Cache des résultats de requête
let clientRegimeCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getClientRegimeStats = async (): Promise<{ 
  igsClients: number;
  reelClients: number; 
  unpaidIGS: number;
  clientsWithPaymentInfo: number;
}> => {
  // Vérifier si le cache est valide
  const now = Date.now();
  if (clientRegimeCache && now - cacheTimestamp < CACHE_DURATION) {
    console.log("Utilisation du cache pour les statistiques de régime fiscal");
    return clientRegimeCache;
  }

  console.log("Récupération des statistiques de régime fiscal depuis la base de données");
  
  // Récupérer tous les clients
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  // Initialiser les compteurs
  let igsClients = 0;
  let reelClients = 0;
  let unpaidIGS = 0;
  let clientsWithPaymentInfo = 0;
  
  const currentDate = new Date();
  
  // Analyser chaque client
  allClients.forEach((client: any) => {
    if (client.regimefiscal === "igs") {
      igsClients++;
      
      // Vérifier si caché du tableau de bord
      const fiscalDataObj = client.fiscal_data && typeof client.fiscal_data === 'object' ? client.fiscal_data : {};
      if (fiscalDataObj && 'hiddenFromDashboard' in fiscalDataObj && fiscalDataObj.hiddenFromDashboard === true) {
        console.log(`Client ${client.id} caché du tableau de bord`);
        return;
      }
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Vérifier directement dans l'objet client.igs
      if (typedClient.igs && typeof typedClient.igs === 'object' && 'soumisIGS' in typedClient.igs && typedClient.igs.soumisIGS) {
        clientsWithPaymentInfo++;
        
        // Utiliser le système de suivi des paiements avec completedPayments
        if (typedClient.igs.completedPayments && Array.isArray(typedClient.igs.completedPayments)) {
          const paymentStatus = calculatePaymentStatus(typedClient.igs.completedPayments, currentDate);
          
          if (!paymentStatus.isUpToDate) {
            unpaidIGS++;
          }
        } 
        // Ancien système : vérifier les acomptes individuels (fallback)
        else {
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && (!typedClient.igs.acompteJanvier || !typedClient.igs.acompteJanvier?.montant)) {
            unpaidIGS++;
          }
          else if (currentMonth > 1 && (!typedClient.igs.acompteFevrier || !typedClient.igs.acompteFevrier?.montant)) {
            unpaidIGS++;
          }
        }
      } 
      // Chercher les données IGS dans fiscal_data si elles n'existent pas directement
      else if (client.fiscal_data) {
        const fiscalData = client.fiscal_data && typeof client.fiscal_data === 'object' ? client.fiscal_data : {};
        
        // Vérifier si caché du tableau de bord
        if (fiscalData && 'hiddenFromDashboard' in fiscalData && fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord via fiscal_data`);
          return;
        }
        
        // Vérifie si fiscalData.igs existe et est un objet avec soumisIGS
        const igsData = fiscalData && 'igs' in fiscalData ? fiscalData.igs : null;
        
        if (igsData && typeof igsData === 'object' && 'soumisIGS' in igsData && igsData.soumisIGS) {
          clientsWithPaymentInfo++;
          
          // Utiliser le système de suivi des paiements avec completedPayments
          if ('completedPayments' in igsData && Array.isArray(igsData.completedPayments)) {
            const paymentStatus = calculatePaymentStatus(igsData.completedPayments, currentDate);
            
            if (!paymentStatus.isUpToDate) {
              unpaidIGS++;
            }
          } 
          // Ancien système (fallback)
          else {
            const currentMonth = currentDate.getMonth();
            
            if (currentMonth > 0 && (!igsData.acompteJanvier || (typeof igsData.acompteJanvier === 'object' && !igsData.acompteJanvier?.montant))) {
              unpaidIGS++;
            } else if (currentMonth > 1 && (!igsData.acompteFevrier || (typeof igsData.acompteFevrier === 'object' && !igsData.acompteFevrier?.montant))) {
              unpaidIGS++;
            }
          }
        } else {
          // Si le client est IGS mais sans données complètes, le compter comme en retard
          unpaidIGS++;
        }
      } else {
        // Si le client est IGS mais sans données complètes, le compter comme en retard
        unpaidIGS++;
      }
    } 
    else if (client.regimefiscal === "reel") {
      reelClients++;
    }
  });

  // Stocker les résultats dans le cache
  clientRegimeCache = {
    igsClients,
    reelClients,
    unpaidIGS,
    clientsWithPaymentInfo
  };
  
  cacheTimestamp = now;
  
  console.log(`Statistiques calculées: ${igsClients} clients IGS, ${reelClients} clients au réel, ${unpaidIGS} IGS impayés`);
  
  return clientRegimeCache;
};
