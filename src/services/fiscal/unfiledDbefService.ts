
import { supabase } from "@/integrations/supabase/client";
import type { ClientFiscalData } from "@/hooks/fiscal/types";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnfiledDbef = async (): Promise<Client[]> => {
  try {
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      return [];
    }

    if (!clientsData) return [];

    const clients = clientsData.map(mapClientRowToClient);

    return clients.filter(client => {
      try {
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "dbef");
        if (!shouldBeSubject) return false;

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true;
        }

        const fiscalData = client.fiscal_data as ClientFiscalData;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];

        if (!yearObligations || typeof yearObligations !== 'object') {
          return true;
        }

        const dbefObligation = yearObligations.dbef;

        if (!dbefObligation || typeof dbefObligation !== 'object') {
          return true;
        }

        const isSubject = dbefObligation.assujetti === true;
        const isFiled = dbefObligation.depose === true;

        return isSubject && !isFiled;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
};
