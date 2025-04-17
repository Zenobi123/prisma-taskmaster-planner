
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { calculatePaymentStatus } from "@/components/clients/identity/igs/utils/igsCalculations";

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec IGS impayés...");
  
  // Récupérer tous les clients
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  const currentDate = new Date();

  // Filtrer les clients avec IGS impayé
  const clientsWithUnpaidIGS = allClients.filter(client => {
    // Vérifier si c'est un client IGS
    if (client.regimefiscal === "igs") {
      console.log(`Vérification du client IGS: ${client.id} - ${client.nom || client.raisonsociale}`);
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Ne pas inclure si explicitement marqué comme caché du tableau de bord
      if (typedClient.fiscal_data && typeof typedClient.fiscal_data === 'object') {
        const fiscalData = typedClient.fiscal_data;
        if (fiscalData && 
            typeof fiscalData === 'object' && 
            'hiddenFromDashboard' in fiscalData && 
            fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord`);
          return false;
        }
      }
      
      // Vérifier directement dans l'objet client.igs
      if (typedClient.igs && typeof typedClient.igs === 'object') {
        // Vérifier si soumisIGS est défini et est true
        if ('soumisIGS' in typedClient.igs && typedClient.igs.soumisIGS === true) {
          console.log(`Données IGS pour client ${client.id}:`, JSON.stringify(typedClient.igs));
          
          // Utiliser le système de suivi des paiements avec completedPayments
          if (typedClient.igs.completedPayments && Array.isArray(typedClient.igs.completedPayments)) {
            // Fix TypeScript error - ensure we're passing string[] to calculatePaymentStatus
            const payments = typedClient.igs.completedPayments.map(payment => 
              typeof payment === 'string' ? payment : String(payment)
            );
            
            const paymentStatus = calculatePaymentStatus(payments, currentDate);
            console.log(`Client ${client.id} - statut de paiement:`, paymentStatus);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} en retard selon le système de suivi des paiements`);
              return true;
            }
            return false;
          }
          
          // Ancien système : vérifier les acomptes individuels (fallback)
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && 
              typedClient.igs.acompteJanvier && 
              typeof typedClient.igs.acompteJanvier === 'object' && 
              (!('montant' in typedClient.igs.acompteJanvier) || !typedClient.igs.acompteJanvier.montant)) {
            console.log(`Client ${client.id} n'a pas payé l'acompte de janvier`);
            return true;
          }
          else if (currentMonth > 1 && 
                  typedClient.igs.acompteFevrier && 
                  typeof typedClient.igs.acompteFevrier === 'object' && 
                  (!('montant' in typedClient.igs.acompteFevrier) || !typedClient.igs.acompteFevrier.montant)) {
            console.log(`Client ${client.id} n'a pas payé l'acompte de février`);
            return true;
          }
          return false;
        } else {
          console.log(`Client ${client.id} a des données IGS mais n'est pas marqué comme soumis`);
          return false;
        }
      } else if (client.fiscal_data) {
        // Vérifier dans fiscal_data.igs comme alternative
        const fiscalData = client.fiscal_data && typeof client.fiscal_data === 'object' ? client.fiscal_data : {};
        
        // Ne pas inclure si caché du tableau de bord
        if (fiscalData && 
            typeof fiscalData === 'object' && 
            'hiddenFromDashboard' in fiscalData && 
            fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord via fiscal_data`);
          return false;
        }
        
        // Vérifie si fiscalData.igs existe et est un objet avec soumisIGS
        const igsData = fiscalData && 'igs' in fiscalData ? fiscalData.igs : null;
        
        if (igsData && 
            typeof igsData === 'object' && 
            igsData !== null &&
            'soumisIGS' in igsData && 
            igsData.soumisIGS === true) {
          console.log(`Données IGS dans fiscal_data pour client ${client.id}:`, JSON.stringify(igsData));
          
          // Utiliser le système de suivi des paiements avec completedPayments
          if ('completedPayments' in igsData && Array.isArray(igsData.completedPayments)) {
            // Fix TypeScript error - ensure we're passing string[] to calculatePaymentStatus
            const payments = (igsData.completedPayments).map(payment => 
              typeof payment === 'string' ? payment : String(payment)
            );
            
            const paymentStatus = calculatePaymentStatus(payments, currentDate);
            console.log(`Client ${client.id} - statut de paiement (via fiscal_data):`, paymentStatus);
            
            if (!paymentStatus.isUpToDate) {
              console.log(`Client ${client.id} en retard selon le système de suivi des paiements (via fiscal_data)`);
              return true;
            }
            return false;
          }
          
          // Ancien système (fallback)
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && 
              'acompteJanvier' in igsData &&
              igsData.acompteJanvier && 
              typeof igsData.acompteJanvier === 'object' && 
              (!('montant' in igsData.acompteJanvier) || !igsData.acompteJanvier.montant)) {
            console.log(`Client ${client.id} n'a pas payé l'acompte de janvier (via fiscal_data)`);
            return true;
          } else if (currentMonth > 1 && 
                    'acompteFevrier' in igsData &&
                    igsData.acompteFevrier && 
                    typeof igsData.acompteFevrier === 'object' && 
                    (!('montant' in igsData.acompteFevrier) || !igsData.acompteFevrier.montant)) {
            console.log(`Client ${client.id} n'a pas payé l'acompte de février (via fiscal_data)`);
            return true;
          }
          return false;
        } else {
          console.log(`Client ${client.id} est IGS mais sans données IGS définies comme soumis dans fiscal_data`);
          return false;
        }
      } else {
        console.log(`Client ${client.id} est IGS mais sans données IGS définies`);
        return false; // Client IGS sans données n'est plus considéré en retard automatiquement
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec IGS impayés:", clientsWithUnpaidIGS.length);
  
  return clientsWithUnpaidIGS as unknown as Client[];
};
