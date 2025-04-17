
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
      console.log(`Vérification du client IGS: ${client.id}`);
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Ne pas inclure si explicitement marqué comme caché du tableau de bord
      if (typedClient.fiscal_data && typeof typedClient.fiscal_data === 'object') {
        const fiscalData = typedClient.fiscal_data as any;
        if (fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord`);
          return false;
        }
      }
      
      // Vérifier directement dans l'objet client.igs
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
          console.log(`Client ${client.id} n'a pas payé l'acompte de janvier`);
          return true;
        }
        else if (currentMonth > 1 && (!typedClient.igs.acompteFevrier || !typedClient.igs.acompteFevrier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de février`);
          return true;
        }
      } else if (client.fiscal_data) {
        // Check fiscal_data.igs as an alternative
        const fiscalData = client.fiscal_data as any;
        
        // Skip if hidden from dashboard
        if (fiscalData.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord via fiscal_data`);
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
          
          // Fallback pour la méthode ancienne
          const currentMonth = currentDate.getMonth();
          
          if (currentMonth > 0 && (!igsData.acompteJanvier || !igsData.acompteJanvier.montant)) {
            return true;
          } else if (currentMonth > 1 && (!igsData.acompteFevrier || !igsData.acompteFevrier.montant)) {
            return true;
          }
        } else {
          console.log(`Client ${client.id} est IGS mais sans données IGS définies dans fiscal_data`);
          return true;
        }
      } else {
        console.log(`Client ${client.id} est IGS mais sans données IGS définies`);
        return true; // Si le client est IGS mais n'a pas de données IGS, on le considère en retard
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec IGS impayés:", clientsWithUnpaidIGS.length);
  
  return clientsWithUnpaidIGS as unknown as Client[];
};
