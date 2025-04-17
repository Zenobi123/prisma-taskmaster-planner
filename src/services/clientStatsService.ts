
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { calculatePaymentStatus } from "@/components/clients/identity/igs/utils/igsCalculations";

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
  const currentDate = new Date();
  
  const unpaidPatenteClients = allClients.filter(client => {
    // Vérifier si c'est un client IGS
    if (client.regimefiscal === "igs") {
      console.log(`Analyse du client IGS ${client.id} pour statistiques`);
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Vérifier si caché du tableau de bord
      if (typedClient.fiscal_data?.hiddenFromDashboard === true) {
        return false;
      }
      
      // Vérifier si le client a des données IGS, soit directement, soit dans fiscal_data
      if (typedClient.igs && typedClient.igs.soumisIGS) {
        console.log(`Données IGS pour client ${client.id}:`, typedClient.igs);
        
        // Utiliser le nouveau système de suivi des paiements avec completedPayments
        if (Array.isArray(typedClient.igs.completedPayments)) {
          const paymentStatus = calculatePaymentStatus(typedClient.igs.completedPayments, currentDate);
          
          if (!paymentStatus.isUpToDate) {
            console.log(`Client ${client.id} en retard selon le système de suivi des paiements`);
            return true;
          }
          return false;
        }
        
        // Fallback: vérifier les acomptes individuels
        const currentMonth = currentDate.getMonth();
        
        if (currentMonth > 0 && (!typedClient.igs.acompteJanvier || !typedClient.igs.acompteJanvier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de janvier - ajouté aux statistiques`);
          return true;
        }
        else if (currentMonth > 1 && (!typedClient.igs.acompteFevrier || !typedClient.igs.acompteFevrier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de février - ajouté aux statistiques`);
          return true;
        }
      } else if (client.fiscal_data) {
        // Check fiscal_data.igs as an alternative
        const fiscalData = client.fiscal_data as any;
        
        // Skip if hidden from dashboard
        if (fiscalData.hiddenFromDashboard === true) {
          return false;
        }
        
        if (fiscalData.igs && fiscalData.igs.soumisIGS) {
          const igsData = fiscalData.igs;
          
          // Utiliser le nouveau système de suivi des paiements avec completedPayments
          if (Array.isArray(igsData.completedPayments)) {
            const paymentStatus = calculatePaymentStatus(igsData.completedPayments, currentDate);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} en retard selon le système de suivi des paiements (via fiscal_data)`);
              return true;
            }
            return false;
          }
          
          // Fallback pour la méthode ancienne (vérification des acomptes)
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
            return true;
          } else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
            return true;
          }
        } else {
          console.log(`Client ${client.id} est IGS mais sans données IGS définies dans fiscal_data - ajouté aux statistiques`);
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
