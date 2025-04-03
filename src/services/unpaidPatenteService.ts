
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique } from "@/types/client";
import { ClientFiscalData, defaultClientFiscalData } from "@/hooks/fiscal/types";

// Get clients with unpaid patente
export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  try {
    // Get all active clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error retrieving clients:", error);
      return [];
    }

    // Filter clients who have patente as an unpaid obligation
    const clientsWithUnpaidPatente = clients.filter(client => {
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

      // Check if client is subject to patente and if it's not paid
      const patenteObligation = fiscalData?.obligations?.patente;
      return patenteObligation?.assujetti && !patenteObligation?.paye;
    });

    // Format clients for return with proper type handling
    return clientsWithUnpaidPatente.map(client => {
      // Ensure adresse and contact have the correct structure
      const adresse = typeof client.adresse === 'object' ? client.adresse : { 
        ville: '', 
        quartier: '', 
        lieuDit: '' 
      };
      
      const contact = typeof client.contact === 'object' ? client.contact : {
        telephone: '',
        email: ''
      };
      
      return {
        id: client.id,
        type: client.type as ClientType,
        nom: client.nom,
        raisonsociale: client.raisonsociale,
        sigle: client.sigle,
        datecreation: client.datecreation,
        lieucreation: client.lieucreation,
        nomdirigeant: client.nomdirigeant,
        formejuridique: client.formejuridique as FormeJuridique,
        niu: client.niu,
        centrerattachement: client.centrerattachement,
        statut: client.statut,
        secteuractivite: client.secteuractivite,
        numerocnps: client.numerocnps,
        gestionexternalisee: client.gestionexternalisee,
        sexe: client.sexe,
        etatcivil: client.etatcivil,
        regimefiscal: client.regimefiscal,
        adresse: {
          ville: adresse.ville || '',
          quartier: adresse.quartier || '',
          lieuDit: adresse.lieuDit || ''
        },
        contact: {
          telephone: contact.telephone || '',
          email: contact.email || ''
        },
        interactions: client.interactions || [],
        situationimmobiliere: client.situationimmobiliere,
        created_at: client.created_at
      };
    });
  } catch (error) {
    console.error("Error retrieving clients with unpaid patente:", error);
    return [];
  }
};
