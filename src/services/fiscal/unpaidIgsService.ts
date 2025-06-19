
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnpaidIgs = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unpaid IGS from fiscal_data...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData) {
      console.log("No clients data found");
      return [];
    }

    console.log(`Processing ${clientsData.length} active clients for IGS status`);

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unpaidIgsClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à l'IGS
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "igs");
        if (!shouldBeSubject) {
          return false;
        }

        console.log(`Client ${client.id} should be subject to IGS`);

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          console.log(`Client ${client.id} has no fiscal data - considering as unpaid`);
          return true; // Devrait être assujetti mais pas de données = non payé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          console.log(`Client ${client.id} has no obligations for year ${selectedYear} - considering as unpaid`);
          return true; // Devrait être assujetti mais pas d'obligations = non payé
        }

        const igsObligation = yearObligations.igs;
        
        if (!igsObligation || typeof igsObligation !== 'object') {
          console.log(`Client ${client.id} has no IGS obligation - considering as unpaid`);
          return true; // Devrait être assujetti mais pas d'obligation IGS = non payé
        }

        // Client avec IGS non payée : assujetti = true ET payee = false
        const isSubjectToIgs = igsObligation.assujetti === true;
        const isIgsPaid = igsObligation.payee === true;

        console.log(`Client ${client.id} IGS status: subject=${isSubjectToIgs}, paid=${isIgsPaid}`);

        return isSubjectToIgs && !isIgsPaid;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unpaidIgsClients.length} clients with unpaid IGS out of ${clients.length} total clients`);
    return unpaidIgsClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnpaidIgs:', error);
    return [];
  }
};
