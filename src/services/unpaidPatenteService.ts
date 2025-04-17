
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
      // Vérifier les données fiscales IGS
      if (client.fiscal_data && typeof client.fiscal_data === 'object' && client.fiscal_data !== null) {
        const fiscalData = client.fiscal_data as any;
        
        // Ne pas inclure si explicitement marqué comme caché du tableau de bord
        if (fiscalData.hiddenFromDashboard === true) {
          return false;
        }
        
        // Vérifier si les paiements IGS sont à jour
        if (fiscalData.igs) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          
          // Vérifier si nous sommes après janvier mais qu'aucun acompte n'a été payé
          if (currentMonth > 0 && (!fiscalData.igs.acompteJanvier || !fiscalData.igs.acompteJanvier.montant)) {
            return true;
          }
          // Vérifier si nous sommes après février mais que l'acompte de février n'a pas été payé
          else if (currentMonth > 1 && (!fiscalData.igs.acompteFevrier || !fiscalData.igs.acompteFevrier.montant)) {
            return true;
          }
        }
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec IGS impayés:", clientsWithUnpaidIGS.length);
  
  return clientsWithUnpaidIGS as unknown as Client[];
};
