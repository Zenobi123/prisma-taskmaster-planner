
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { calculatePaymentStatus } from "@/components/clients/identity/igs/utils/igsCalculations";

// Cache des résultats de requête
let clientRegimeCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getClientRegimeStats = async (): Promise<{ 
  igsClients: number;
  simplifieClients: number; 
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
  let simplifieClients = 0;
  let unpaidIGS = 0;
  let clientsWithPaymentInfo = 0;
  
  console.log(`Nombre total de clients récupérés: ${allClients.length}`);
  
  const currentDate = new Date();
  
  // Analyser chaque client
  allClients.forEach((client: any) => {
    // Log pour débogage
    console.log(`Analyse du client ${client.id} (${client.nom || client.raisonsociale}) - Régime: ${client.regimefiscal}`);
    
    // Vérifier si le client est en régime IGS
    if (client.regimefiscal === "igs") {
      // Incrémenter le compteur de clients IGS, indépendamment de leur statut de paiement
      igsClients++;
      console.log(`Client ${client.id} compté comme client IGS - Total: ${igsClients}`);
      
      // Vérifier si caché du tableau de bord
      const fiscalDataObj = client.fiscal_data && typeof client.fiscal_data === 'object' ? client.fiscal_data : {};
      if (fiscalDataObj && 'hiddenFromDashboard' in fiscalDataObj && fiscalDataObj.hiddenFromDashboard === true) {
        console.log(`Client ${client.id} caché du tableau de bord`);
        return;
      }
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Vérifier directement dans l'objet client.igs
      if (typedClient.igs && typeof typedClient.igs === 'object') {
        // Vérifier si soumisIGS existe et est true
        if ('soumisIGS' in typedClient.igs && typedClient.igs.soumisIGS === true) {
          console.log(`Client ${client.id} est soumis à l'IGS`);
          clientsWithPaymentInfo++;
          
          // Utiliser le système de suivi des paiements avec completedPayments
          if (typedClient.igs.completedPayments && Array.isArray(typedClient.igs.completedPayments)) {
            // Fix TypeScript error - ensure we're passing string[] to calculatePaymentStatus
            const payments = typedClient.igs.completedPayments.map(payment => 
              typeof payment === 'string' ? payment : String(payment)
            );
            
            const paymentStatus = calculatePaymentStatus(payments, currentDate);
            console.log(`Client ${client.id} - statut de paiement:`, paymentStatus);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} ajouté aux IGS impayés`);
              unpaidIGS++;
            }
          } 
          // Ancien système : vérifier les acomptes individuels (fallback)
          else {
            const currentMonth = currentDate.getMonth();
            
            if (currentMonth > 0 && 
                (!typedClient.igs.acompteJanvier || 
                 (typeof typedClient.igs.acompteJanvier === 'object' && 
                  !('montant' in typedClient.igs.acompteJanvier && typedClient.igs.acompteJanvier.montant)))) {
              console.log(`Client ${client.id} n'a pas payé l'acompte de janvier - ajouté aux IGS impayés`);
              unpaidIGS++;
            }
            else if (currentMonth > 1 && 
                    (!typedClient.igs.acompteFevrier || 
                     (typeof typedClient.igs.acompteFevrier === 'object' && 
                      !('montant' in typedClient.igs.acompteFevrier && typedClient.igs.acompteFevrier.montant)))) {
              console.log(`Client ${client.id} n'a pas payé l'acompte de février - ajouté aux IGS impayés`);
              unpaidIGS++;
            }
          }
        } else {
          console.log(`Client ${client.id} a des données IGS mais n'est pas marqué comme soumis`);
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
        
        if (igsData && typeof igsData === 'object') {
          if ('soumisIGS' in igsData && igsData.soumisIGS === true) {
            console.log(`Client ${client.id} est soumis à l'IGS via fiscal_data`);
            clientsWithPaymentInfo++;
            
            // Utiliser le système de suivi des paiements avec completedPayments
            if ('completedPayments' in igsData && Array.isArray(igsData.completedPayments)) {
              // Fix TypeScript error - ensure we're passing string[] to calculatePaymentStatus
              const payments = (igsData.completedPayments as any[]).map(payment => 
                typeof payment === 'string' ? payment : String(payment)
              );
              
              const paymentStatus = calculatePaymentStatus(payments, currentDate);
              console.log(`Client ${client.id} - statut de paiement (via fiscal_data):`, paymentStatus);
              
              if (!paymentStatus.isUpToDate) {
                console.log(`Client ${client.id} ajouté aux IGS impayés (via fiscal_data)`);
                unpaidIGS++;
              }
            } 
            // Ancien système (fallback)
            else {
              const currentMonth = currentDate.getMonth();
              
              if (currentMonth > 0 && 
                  (!igsData.acompteJanvier || 
                   (typeof igsData.acompteJanvier === 'object' && 
                    !('montant' in igsData.acompteJanvier || !igsData.acompteJanvier.montant)))) {
                console.log(`Client ${client.id} n'a pas payé l'acompte de janvier (via fiscal_data) - ajouté aux IGS impayés`);
                unpaidIGS++;
              } else if (currentMonth > 1 && 
                        (!igsData.acompteFevrier || 
                         (typeof igsData.acompteFevrier === 'object' && 
                          !('montant' in igsData.acompteFevrier || !igsData.acompteFevrier.montant)))) {
                console.log(`Client ${client.id} n'a pas payé l'acompte de février (via fiscal_data) - ajouté aux IGS impayés`);
                unpaidIGS++;
              }
            }
          } else {
            console.log(`Client ${client.id} a des données IGS dans fiscal_data mais n'est pas marqué comme soumis`);
          }
        } else {
          console.log(`Client ${client.id} est IGS mais n'a pas de données IGS valides dans fiscal_data`);
        }
      } else {
        console.log(`Client ${client.id} est IGS mais n'a aucune donnée IGS`);
      }
    } 
    else if (client.regimefiscal === "simplifie") {
      simplifieClients++;
      console.log(`Client ${client.id} compté comme client au régime simplifié - Total: ${simplifieClients}`);
    }
  });

  // Stocker les résultats dans le cache
  clientRegimeCache = {
    igsClients,
    simplifieClients,
    unpaidIGS,
    clientsWithPaymentInfo
  };
  
  cacheTimestamp = now;
  
  console.log(`Statistiques calculées: ${igsClients} clients IGS, ${simplifieClients} clients au régime simplifié, ${unpaidIGS} IGS impayés`);
  
  return clientRegimeCache;
};
