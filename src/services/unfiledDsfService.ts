
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData, defaultClientFiscalData } from "@/hooks/fiscal/types";

// Récupérer les clients avec la DSF non déposée
export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
  try {
    // Récupérer tous les clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*, fiscal_data:fiscal_data(*)')
      .eq('statut', 'actif')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }

    // Filtrer les clients qui ont la DSF comme obligation non déposée
    const clientsWithUnfiledDsf = clients.filter(client => {
      // Convertir les données fiscales
      const fiscalData = client.fiscal_data ? 
        (typeof client.fiscal_data === 'string' 
          ? JSON.parse(client.fiscal_data) 
          : client.fiscal_data as unknown as ClientFiscalData) 
        : defaultClientFiscalData;
        
      // Vérifier si les données sont cachées du tableau de bord
      if (fiscalData.hiddenFromDashboard) {
        return false;
      }

      // Vérifier si le client est assujetti à la DSF et si elle n'est pas déposée
      const dsfObligation = fiscalData?.obligations?.dsf;
      return dsfObligation?.assujetti && !dsfObligation?.depose;
    });

    // Formater les clients pour le retour
    return clientsWithUnfiledDsf.map(client => ({
      id: client.id,
      type: client.type,
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
      adresse: {
        ville: client.ville || '',
        quartier: client.quartier || '',
        lieuDit: client.lieuDit || ''
      },
      contact: {
        telephone: client.telephone || '',
        email: client.email || ''
      },
      interactions: client.interactions || [],
      situationimmobiliere: client.situationimmobiliere,
      created_at: client.created_at,
      updated_at: client.updated_at
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des clients avec DSF non déposée:", error);
    return [];
  }
};
