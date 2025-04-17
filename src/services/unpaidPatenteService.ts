
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
      
      // Vérifier directement dans l'objet client.igs
      if (client.igs) {
        console.log(`Données IGS pour client ${client.id}:`, client.igs);
        
        // Ne pas inclure si explicitement marqué comme caché du tableau de bord
        if (client.fiscal_data && client.fiscal_data.hiddenFromDashboard === true) {
          console.log(`Client ${client.id} caché du tableau de bord`);
          return false;
        }
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        
        // Vérifier si nous sommes après janvier mais qu'aucun acompte n'a été payé
        if (currentMonth > 0 && (!client.igs.acompteJanvier || !client.igs.acompteJanvier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de janvier`);
          return true;
        }
        // Vérifier si nous sommes après février mais que l'acompte de février n'a pas été payé
        else if (currentMonth > 1 && (!client.igs.acompteFevrier || !client.igs.acompteFevrier.montant)) {
          console.log(`Client ${client.id} n'a pas payé l'acompte de février`);
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
