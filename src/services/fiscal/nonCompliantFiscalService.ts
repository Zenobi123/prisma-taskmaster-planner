
import { supabase } from "@/integrations/supabase/client";

export interface NonCompliantClient {
  id: string;
  nom?: string;
  raisonsociale?: string;
  niu: string;
  centrerattachement?: string;
}

export const getClientsWithNonCompliantFiscalSituation = async (): Promise<NonCompliantClient[]> => {
  try {
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, nom, raisonsociale, niu, centrerattachement, fiscal_data')
      .eq('statut', 'actif');

    if (error) {
      return [];
    }

    if (!clients) {
      return [];
    }

    // Filter clients with non-compliant fiscal situation
    const nonCompliantClients = clients.filter(client => {
      if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
        return false;
      }

      const fiscalData = client.fiscal_data as any;
      
      // Check if attestation exists and fiscal situation is not compliant
      if (fiscalData.attestation && typeof fiscalData.attestation === 'object') {
        const attestation = fiscalData.attestation;
        return attestation.fiscalSituationCompliant === false;
      }

      return false;
    });

    
    return nonCompliantClients.map(client => ({
      id: client.id,
      nom: client.nom,
      raisonsociale: client.raisonsociale,
      niu: client.niu,
      centrerattachement: client.centrerattachement
    }));
  } catch (error) {
    return [];
  }
};
