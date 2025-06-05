
import { supabase } from "@/integrations/supabase/client";

export const getClientsNotInFanrH2 = async () => {
  try {
    console.log("Récupération des clients non inscrits en FANR H2...");
    
    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .eq("statut", "actif")
      .or("inscriptionfanrharmony2.is.null,inscriptionfanrharmony2.eq.false");

    if (error) {
      console.error("Erreur lors de la récupération des clients non inscrits FANR H2:", error);
      throw error;
    }

    console.log("Clients non inscrits FANR H2 récupérés:", clients?.length || 0);
    return clients || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des clients non inscrits FANR H2:", error);
    throw error;
  }
};
