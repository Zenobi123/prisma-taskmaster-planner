
import { supabase } from "@/integrations/supabase/client";
import type { ClientFiscalData } from "@/hooks/fiscal/types";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
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

    const unfiledDsfClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la DSF
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "dsf");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non déposé
        }

        const fiscalData = client.fiscal_data as ClientFiscalData;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non déposé
        }

        const dsfObligation = yearObligations.dsf;
        
        if (!dsfObligation || typeof dsfObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation DSF = non déposé
        }

        // Client avec DSF non déposée : assujetti = true ET depose = false
        const isSubjectToDsf = dsfObligation.assujetti === true;
        const isDsfFiled = dsfObligation.depose === true;

        return isSubjectToDsf && !isDsfFiled;
      } catch (error) {
        return false;
      }
    });

    return unfiledDsfClients;
    
  } catch (error) {
    return [];
  }
};
