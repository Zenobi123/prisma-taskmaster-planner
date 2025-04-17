
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
      console.log(`Analyse du client IGS ${client.id} (${client.nom || client.raisonsociale}) pour statistiques`);
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Vérifier si caché du tableau de bord
      if (typedClient.fiscal_data) {
        const fiscalData = typedClient.fiscal_data && typeof typedClient.fiscal_data === 'object' ? typedClient.fiscal_data : {};
        if (fiscalData && typeof fiscalData === 'object' && 'hiddenFromDashboard' in fiscalData && fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord - exclu des statistiques`);
          return false;
        }
      }
      
      // Vérifier si le client a des données IGS, soit directement, soit dans fiscal_data
      if (typedClient.igs && typeof typedClient.igs === 'object') {
        if ('soumisIGS' in typedClient.igs && typedClient.igs.soumisIGS === true) {
          console.log(`Données IGS pour client ${client.id}:`, JSON.stringify(typedClient.igs));
          
          // Utiliser le système de suivi des paiements avec completedPayments
          if (Array.isArray(typedClient.igs.completedPayments)) {
            const paymentStatus = calculatePaymentStatus(typedClient.igs.completedPayments, currentDate);
            console.log(`Client ${client.id} - statut de paiement:`, paymentStatus);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} en retard selon le système de suivi des paiements - ajouté aux statistiques`);
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
          return false;
        } else {
          console.log(`Client ${client.id} a des données IGS mais n'est pas marqué comme soumis - non compté`);
          return false;
        }
      } else if (client.fiscal_data) {
        // Check fiscal_data.igs as an alternative
        const fiscalData = client.fiscal_data && typeof client.fiscal_data === 'object' ? client.fiscal_data : {};
        
        // Skip if hidden from dashboard
        if (fiscalData && typeof fiscalData === 'object' && 'hiddenFromDashboard' in fiscalData && fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord via fiscal_data - exclu des statistiques`);
          return false;
        }
        
        // Vérifier si igs existe dans fiscal_data
        const igsData = fiscalData && 'igs' in fiscalData ? fiscalData.igs : null;
        
        if (igsData && typeof igsData === 'object' && 'soumisIGS' in igsData && igsData.soumisIGS === true) {
          console.log(`Données IGS dans fiscal_data pour client ${client.id}:`, JSON.stringify(igsData));
          
          // Utiliser le système de suivi des paiements avec completedPayments
          if (Array.isArray(igsData.completedPayments)) {
            const paymentStatus = calculatePaymentStatus(igsData.completedPayments, currentDate);
            console.log(`Client ${client.id} - statut de paiement (via fiscal_data):`, paymentStatus);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} en retard selon le système de suivi des paiements (via fiscal_data) - ajouté aux statistiques`);
              return true;
            }
            return false;
          }
          
          // Fallback pour l'ancien système
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
            console.log(`Client ${client.id} n'a pas payé l'acompte de janvier (via fiscal_data) - ajouté aux statistiques`);
            return true;
          } else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
            console.log(`Client ${client.id} n'a pas payé l'acompte de février (via fiscal_data) - ajouté aux statistiques`);
            return true;
          }
          return false;
        } else {
          console.log(`Client ${client.id} est IGS mais sans données IGS définies ou non soumis dans fiscal_data - non compté`);
          return false;
        }
      } else {
        console.log(`Client ${client.id} est IGS mais sans données IGS définies - non compté`);
        return false; // Client IGS sans données n'est plus considéré en retard automatiquement
      }
    }
    return false;
  }).length;
  
  // Clients avec DSF non déposée
  const unfiledDsfClients = allClients.filter(client => {
    // On vérifie si le client a des données fiscales
    if (client.fiscal_data && typeof client.fiscal_data === 'object' && client.fiscal_data !== null) {
      // Vérifier si caché du tableau de bord
      const fiscalData = client.fiscal_data && typeof client.fiscal_data === 'object' ? client.fiscal_data : {};
      if (fiscalData && typeof fiscalData === 'object' && 'hiddenFromDashboard' in fiscalData && fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      // Vérifier si obligations existe dans les données fiscales
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
