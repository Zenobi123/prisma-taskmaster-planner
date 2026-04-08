
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "./defaultObligationRules";

export const getClientsWithUnpaidTax = async (obligationType: string): Promise<Client[]> => {
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
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, obligationType);
        if (!shouldBeSubject) return false;

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true;
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];

        if (!yearObligations || typeof yearObligations !== 'object') {
          return true;
        }

        const obligation = yearObligations[obligationType];

        if (!obligation || typeof obligation !== 'object') {
          return true;
        }

        return obligation.assujetti === true && obligation.payee !== true;
      } catch (error) {
        return false;
      }
    });
  } catch (error) {
    return [];
  }
};

export const getClientsWithUnpaidBail = () => getClientsWithUnpaidTax("bailCommercial");
export const getClientsWithUnpaidPSL = () => getClientsWithUnpaidTax("precompteLoyer");
export const getClientsWithUnpaidTF = () => getClientsWithUnpaidTax("tpf");
