
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

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

  // Filtrer les clients avec IGS impayé
  const clientsWithUnpaidIGS = allClients.filter(client => {
    // Vérifier si c'est un client IGS
    if (client.regimefiscal === "igs") {
      console.log(`Vérification du client IGS: ${client.id}`);
      
      // Cast client to Client type to properly access IGS data
      const typedClient = client as unknown as Client;
      
      // Vérifier directement dans l'objet client.igs
      if (typedClient.igs) {
        console.log(`Données IGS pour client ${client.id}:`, typedClient.igs);
        
        // Ne pas inclure si explicitement marqué comme caché du tableau de bord
        if (typedClient.fiscal_data && typeof typedClient.fiscal_data === 'object') {
          const fiscalData = typedClient.fiscal_data as any;
          if (fiscalData.hiddenFromDashboard === true) {
            console.log(`Client ${client.id} caché du tableau de bord`);
            return false;
          }
        }
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        
        // Vérifier si nous sommes après janvier mais qu'aucun acompte n'a été payé
        if (currentMonth > 0 && (!typedClient.igs.acompteJanvier || !typedClient.igs.acompteJanvier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de janvier`);
          return true;
        }
        // Vérifier si nous sommes après février mais que l'acompte de février n'a pas été payé
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
        
        if (fiscalData.igs) {
          const igsData = fiscalData.igs;
          const currentDate = new Date();
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
