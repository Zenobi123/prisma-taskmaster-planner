
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType } from "@/types/client";
import { ClientFiscalData, defaultClientFiscalData } from "@/hooks/fiscal/types";

// Get clients with unfiled DSF
export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
  try {
    // Get all clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error retrieving clients:", error);
      return [];
    }

    // Filter clients who have DSF as an unfiled obligation
    const clientsWithUnfiledDsf = clients.filter(client => {
      // Convert fiscal data
      let fiscalData: ClientFiscalData;
      
      try {
        fiscalData = client.fiscal_data ? 
          (typeof client.fiscal_data === 'string' 
            ? JSON.parse(client.fiscal_data) 
            : client.fiscal_data as unknown as ClientFiscalData) 
          : defaultClientFiscalData;
      } catch (e) {
        console.error("Error parsing fiscal data for client:", client.id, e);
        return false;
      }
        
      // Check if data is hidden from dashboard
      if (fiscalData.hiddenFromDashboard) {
        return false;
      }

      // Check if client is subject to DSF and if it's not filed
      const dsfObligation = fiscalData?.obligations?.dsf;
      return dsfObligation?.assujetti && !dsfObligation?.depose;
    });

    // Format clients for return
    return clientsWithUnfiledDsf.map(client => ({
      id: client.id,
      type: client.type as ClientType,
      nom: client.nom,
      raisonsociale: client.raisonsociale,
      sigle: client.sigle,
      datecreation: client.datecreation,
      lieucreation: client.lieucreation,
      nomdirigeant: client.nomdirigeant,
      formejuridique: client.formejuridique,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      statut: client.statut,
      secteuractivite: client.secteuractivite,
      numerocnps: client.numerocnps,
      gestionexternalisee: client.gestionexternalisee,
      sexe: client.sexe,
      etatcivil: client.etatcivil,
      regimefiscal: client.regimefiscal,
      adresse: typeof client.adresse === 'object' ? client.adresse : {
        ville: '',
        quartier: '',
        lieuDit: ''
      },
      contact: typeof client.contact === 'object' ? client.contact : {
        telephone: '',
        email: ''
      },
      interactions: client.interactions || [],
      situationimmobiliere: client.situationimmobiliere,
      created_at: client.created_at
    }));
  } catch (error) {
    console.error("Error retrieving clients with unfiled DSF:", error);
    return [];
  }
};
