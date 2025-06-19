
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnpaidIgs = async (): Promise<Client[]> => {
  try {
    console.log("🔍 Fetching clients with unpaid IGS...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('❌ Error fetching clients:', error);
      return [];
    }

    if (!clientsData) {
      console.log("⚠️ No clients data found");
      return [];
    }

    console.log(`📊 Processing ${clientsData.length} active clients for unpaid IGS`);

    const clients = clientsData.map(mapClientRowToClient);
    let unpaidCount = 0;

    const unpaidIgsClients = clients.filter(client => {
      try {
        // Check if client should be subject to IGS
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "igs");
        
        if (!shouldBeSubject) {
          return false;
        }

        console.log(`✅ Client ${client.id} (${client.nom || client.raisonsociale}) should be subject to IGS`);

        // If no fiscal data, client should pay but hasn't = unpaid
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          console.log(`⚠️ Client ${client.id} has no fiscal data - considering as unpaid`);
          unpaidCount++;
          return true;
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          console.log(`⚠️ Client ${client.id} has no obligations for year ${selectedYear} - considering as unpaid`);
          unpaidCount++;
          return true;
        }

        const igsObligation = yearObligations.igs;
        
        if (!igsObligation || typeof igsObligation !== 'object') {
          console.log(`⚠️ Client ${client.id} has no IGS obligation data - considering as unpaid`);
          unpaidCount++;
          return true;
        }

        // Client is subject to IGS but hasn't paid
        const isSubjectToIgs = igsObligation.assujetti === true;
        const isIgsPaid = igsObligation.payee === true;

        console.log(`📋 Client ${client.id} IGS status: subject=${isSubjectToIgs}, paid=${isIgsPaid}`);

        const isUnpaid = isSubjectToIgs && !isIgsPaid;
        if (isUnpaid) {
          unpaidCount++;
          console.log(`💰 Client ${client.id} has unpaid IGS`);
        }

        return isUnpaid;
      } catch (error) {
        console.error(`❌ Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`🎯 Final result: Found ${unpaidIgsClients.length} clients with unpaid IGS out of ${clients.length} total clients`);
    console.log(`📝 Unpaid clients:`, unpaidIgsClients.map(c => ({ id: c.id, nom: c.nom || c.raisonsociale })));
    
    return unpaidIgsClients;
    
  } catch (error) {
    console.error('❌ Error in getClientsWithUnpaidIgs:', error);
    return [];
  }
};
