
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnfiledDarp = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unfiled DARP from fiscal_data...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData) return [];

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unfiledDarpClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la DARP
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "darp");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non déposé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non déposé
        }

        const darpObligation = yearObligations.darp;
        
        if (!darpObligation || typeof darpObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation DARP = non déposé
        }

        // Client avec DARP non déposée : assujetti = true ET depose = false
        const isSubjectToDarp = darpObligation.assujetti === true;
        const isDarpFiled = darpObligation.depose === true;

        return isSubjectToDarp && !isDarpFiled;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unfiledDarpClients.length} clients with unfiled DARP`);
    return unfiledDarpClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnfiledDarp:', error);
    return [];
  }
};
