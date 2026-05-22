
import { supabase } from "@/integrations/supabase/client";
import type { ClientFiscalData } from "@/hooks/fiscal/types";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnpaidIgs = async (): Promise<Client[]> => {
  try {
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      return [];
    }

    if (!clientsData) {
      return [];
    }


    const clients = clientsData.map(mapClientRowToClient);
    let unpaidCount = 0;

    const unpaidIgsClients = clients.filter(client => {
      try {
        // Check if client should be subject to IGS
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "igs");
        
        if (!shouldBeSubject) {
          return false;
        }


        // If no fiscal data, client should pay but hasn't = unpaid
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          unpaidCount++;
          return true;
        }

        const fiscalData = client.fiscal_data as ClientFiscalData;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          unpaidCount++;
          return true;
        }

        const igsObligation = yearObligations.igs;
        
        if (!igsObligation || typeof igsObligation !== 'object') {
          unpaidCount++;
          return true;
        }

        // Client is subject to IGS but hasn't paid
        const isSubjectToIgs = igsObligation.assujetti === true;
        const isIgsPaid = igsObligation.payee === true;


        const isUnpaid = isSubjectToIgs && !isIgsPaid;
        if (isUnpaid) {
          unpaidCount++;
        }

        return isUnpaid;
      } catch (error) {
        return false;
      }
    });

    
    return unpaidIgsClients;
    
  } catch (error) {
    return [];
  }
};
