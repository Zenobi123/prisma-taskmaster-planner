
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generatePortefeuilleClientsReport = async () => {
  try {
    console.log("Génération du rapport portefeuille clients...");
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*');

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    console.log("Clients récupérés:", clients?.length || 0);

    const reportData = clients?.map(c => {
      const contact = c.contact as any;
      return {
        nom: c.type === 'physique' ? c.nom : c.raisonsociale,
        type: c.type === 'physique' ? 'Personne Physique' : 'Personne Morale',
        niu: c.niu || 'N/A',
        centre_rattachement: c.centrerattachement || 'N/A',
        secteur_activite: c.secteuractivite || 'N/A',
        statut: c.statut || 'actif',
        gestion_externalisee: c.gestionexternalisee ? 'Oui' : 'Non',
        telephone: contact?.telephone || 'N/A'
      };
    }) || [];

    console.log("Données du portefeuille préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport Portefeuille Clients",
      reportData,
      `portefeuille-clients-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport portefeuille:", error);
    throw error;
  }
};

export const generateNouveauxClientsReport = async () => {
  try {
    console.log("Génération du rapport nouveaux clients...");
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (error) {
      console.error("Erreur lors de la récupération des nouveaux clients:", error);
      throw error;
    }

    console.log("Nouveaux clients récupérés:", clients?.length || 0);

    const reportData = clients?.map(c => {
      const contact = c.contact as any;
      return {
        nom: c.type === 'physique' ? c.nom : c.raisonsociale,
        type: c.type === 'physique' ? 'Personne Physique' : 'Personne Morale',
        date_creation: new Date(c.created_at).toLocaleDateString(),
        niu: c.niu || 'N/A',
        secteur_activite: c.secteuractivite || 'N/A',
        telephone: contact?.telephone || 'N/A'
      };
    }) || [];

    console.log("Données nouveaux clients préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport Nouveaux Clients",
      reportData,
      `nouveaux-clients-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport nouveaux clients:", error);
    throw error;
  }
};

export const generateActiviteClientsReport = async () => {
  try {
    console.log("Génération du rapport activité clients...");
    
    const { data: factures, error } = await supabase
      .from('factures')
      .select(`
        client_id,
        montant,
        date,
        clients(nom, raisonsociale, secteuractivite)
      `);

    if (error) {
      console.error("Erreur lors de la récupération de l'activité clients:", error);
      throw error;
    }

    console.log("Factures pour activité récupérées:", factures?.length || 0);

    // Grouper par client
    const clientActivity = factures?.reduce((acc, f) => {
      const clientId = f.client_id;
      if (!acc[clientId]) {
        acc[clientId] = {
          nom: f.clients?.nom || f.clients?.raisonsociale || 'N/A',
          secteur: f.clients?.secteuractivite || 'N/A',
          nombre_factures: 0,
          montant_total: 0,
          derniere_facture: f.date
        };
      }
      
      acc[clientId].nombre_factures++;
      acc[clientId].montant_total += f.montant || 0;
      
      if (new Date(f.date) > new Date(acc[clientId].derniere_facture)) {
        acc[clientId].derniere_facture = f.date;
      }
      
      return acc;
    }, {} as any) || {};

    const reportData = Object.values(clientActivity);

    console.log("Données d'activité clients préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport Activité Clients",
      reportData,
      `activite-clients-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport activité clients:", error);
    throw error;
  }
};
