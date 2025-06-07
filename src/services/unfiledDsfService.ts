
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unfiled DSF from fiscal_data...");
    
    // Récupérer tous les clients actifs
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clients) {
      console.log("No clients found");
      return [];
    }

    console.log(`Found ${clients.length} active clients, checking DSF status...`);

    // Filtrer les clients avec DSF non déposées en utilisant les données fiscales
    const unfiledDsfClients = clients.filter(client => {
      try {
        // Vérifier si le client a des données fiscales
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return false;
        }

        const fiscalData = client.fiscal_data as any;
        
        // Obtenir l'année courante ou l'année sélectionnée
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        
        // Vérifier les obligations pour l'année sélectionnée
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return false;
        }

        // Vérifier le statut DSF
        const dsfObligation = yearObligations.dsf;
        
        if (!dsfObligation || typeof dsfObligation !== 'object') {
          return false;
        }

        // Client avec DSF non déposée : assujetti = true ET depose = false
        const isSubjectToDsf = dsfObligation.assujetti === true;
        const isDsfFiled = dsfObligation.depose === true;

        const shouldInclude = isSubjectToDsf && !isDsfFiled;
        
        if (shouldInclude) {
          console.log(`Client ${client.nom || client.raisonsociale} has unfiled DSF:`, {
            assujetti: dsfObligation.assujetti,
            depose: dsfObligation.depose
          });
        }

        return shouldInclude;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unfiledDsfClients.length} clients with unfiled DSF`);
    return unfiledDsfClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnfiledDsf:', error);
    return [];
  }
};
