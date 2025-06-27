
import { supabase } from "@/integrations/supabase/client";

export const getClientsWithNonCompliantFiscalSituation = async () => {
  try {
    console.log("Récupération des clients avec situation fiscale non conforme...");
    
    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .eq("statut", "actif")
      .eq("inscriptionfanrharmony2", true);

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    if (!clients) return [];

    // Filter clients with non-compliant fiscal situation
    const nonCompliantClients = clients.filter(client => {
      if (!client.fiscal_data || typeof client.fiscal_data !== 'object' || Array.isArray(client.fiscal_data)) {
        return false;
      }

      const fiscalData = client.fiscal_data as any;
      const attestation = fiscalData.attestation;
      
      if (!attestation || typeof attestation !== 'object') {
        return false;
      }

      // Client is non-compliant if fiscalSituationCompliant is explicitly false
      return attestation.fiscalSituationCompliant === false;
    });

    console.log("Clients avec situation fiscale non conforme:", nonCompliantClients.length);
    return nonCompliantClients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients non conformes:", error);
    throw error;
  }
};
