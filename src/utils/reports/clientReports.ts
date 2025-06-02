
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generatePortefeuilleClientsReport = async () => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*');

    if (error) throw error;

    const reportData = clients?.map(c => ({
      nom: c.type === 'physique' ? c.nom : c.raisonsociale,
      type: c.type === 'physique' ? 'Personne Physique' : 'Personne Morale',
      niu: c.niu,
      centre_rattachement: c.centrerattachement,
      secteur_activite: c.secteuractivite,
      statut: c.statut,
      gestion_externalisee: c.gestionexternalisee ? 'Oui' : 'Non',
      telephone: c.contact?.telephone || 'N/A'
    })) || [];

    exportToPdf(
      "Rapport Portefeuille Clients",
      reportData,
      `portefeuille-clients-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport portefeuille:", error);
  }
};

export const generateNouveauxClientsReport = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (error) throw error;

    const reportData = clients?.map(c => ({
      nom: c.type === 'physique' ? c.nom : c.raisonsociale,
      type: c.type,
      date_creation: new Date(c.created_at).toLocaleDateString(),
      niu: c.niu,
      secteur_activite: c.secteuractivite,
      telephone: c.contact?.telephone || 'N/A'
    })) || [];

    exportToPdf(
      "Rapport Nouveaux Clients",
      reportData,
      `nouveaux-clients-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport nouveaux clients:", error);
  }
};

export const generateActiviteClientsReport = async () => {
  try {
    const { data: factures, error } = await supabase
      .from('factures')
      .select(`
        client_id,
        montant,
        date,
        clients(nom, raisonsociale, secteuractivite)
      `);

    if (error) throw error;

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
      acc[clientId].montant_total += f.montant;
      
      if (new Date(f.date) > new Date(acc[clientId].derniere_facture)) {
        acc[clientId].derniere_facture = f.date;
      }
      
      return acc;
    }, {} as any) || {};

    const reportData = Object.values(clientActivity);

    exportToPdf(
      "Rapport Activité Clients",
      reportData,
      `activite-clients-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport activité clients:", error);
  }
};
