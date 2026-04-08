
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  try {
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      return [];
    }

    if (!clientsData) return [];

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unpaidPatenteClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la Patente
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "patente");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non payé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non payé
        }

        const patenteObligation = yearObligations.patente;
        
        if (!patenteObligation || typeof patenteObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation Patente = non payé
        }

        // Client avec Patente non payée : assujetti = true ET payee = false
        const isSubjectToPatente = patenteObligation.assujetti === true;
        const isPatentePaid = patenteObligation.payee === true;

        return isSubjectToPatente && !isPatentePaid;
      } catch (error) {
        return false;
      }
    });

    return unpaidPatenteClients;
    
  } catch (error) {
    return [];
  }
};
