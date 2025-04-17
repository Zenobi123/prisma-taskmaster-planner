
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export const getClientsWithUnpaidIGS = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec IGS impayés...");
  
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  const clientsWithUnpaidIGS = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as any;
      
      // Ne pas inclure si explicitement marqué comme caché du tableau de bord
      if (fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      // Vérifier si IGS existe et est assujetti mais non payé
      if (fiscalData.obligations?.igs) {
        return fiscalData.obligations.igs.assujetti === true && 
               fiscalData.obligations.igs.paye === false;
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec IGS impayés:", clientsWithUnpaidIGS.length);
  return clientsWithUnpaidIGS as Client[];
};
