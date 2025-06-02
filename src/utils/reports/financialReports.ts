
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generateChiffresAffairesReport = async () => {
  try {
    const { data: factures, error } = await supabase
      .from('factures')
      .select('*')
      .eq('status', 'envoyée');

    if (error) throw error;

    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthFactures = factures?.filter(f => {
        const factureDate = new Date(f.date);
        return factureDate.getFullYear() === currentYear && factureDate.getMonth() + 1 === month;
      }) || [];
      
      const totalMonth = monthlyData.reduce((sum, f) => sum + f.montant, 0);
      const paidMonth = monthlyData.reduce((sum, f) => sum + (f.montant_paye || 0), 0);
      
      return {
        mois: `${month}/${currentYear}`,
        chiffre_affaires: totalMonth,
        encaissements: paidMonth,
        en_attente: totalMonth - paidMonth
      };
    });

    exportToPdf(
      "Rapport Chiffre d'Affaires",
      monthlyData,
      `chiffre-affaires-${currentYear}`
    );
  } catch (error) {
    console.error("Erreur génération rapport CA:", error);
  }
};

export const generateFacturationReport = async () => {
  try {
    const { data: factures, error } = await supabase
      .from('factures')
      .select(`
        *,
        clients(nom, raisonsociale)
      `);

    if (error) throw error;

    const reportData = factures?.map(f => ({
      numero_facture: f.id,
      client: f.clients?.nom || f.clients?.raisonsociale || 'N/A',
      date_emission: f.date,
      montant: f.montant,
      montant_paye: f.montant_paye || 0,
      statut: f.status_paiement,
      echeance: f.echeance
    })) || [];

    exportToPdf(
      "Rapport de Facturation",
      reportData,
      `facturation-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport facturation:", error);
  }
};

export const generateCreancesReport = async () => {
  try {
    const { data: factures, error } = await supabase
      .from('factures')
      .select(`
        *,
        clients(nom, raisonsociale, contact)
      `)
      .in('status_paiement', ['non_payée', 'partiellement_payée', 'en_retard']);

    if (error) throw error;

    const reportData = factures?.map(f => {
      const solde = f.montant - (f.montant_paye || 0);
      const today = new Date();
      const echeance = new Date(f.echeance);
      const joursRetard = Math.max(0, Math.floor((today.getTime() - echeance.getTime()) / (1000 * 60 * 60 * 24)));
      
      return {
        client: f.clients?.nom || f.clients?.raisonsociale || 'N/A',
        facture: f.id,
        montant_du: solde,
        echeance: f.echeance,
        jours_retard: joursRetard,
        telephone: f.clients?.contact?.telephone || 'N/A'
      };
    }).filter(f => f.montant_du > 0) || [];

    exportToPdf(
      "Rapport des Créances",
      reportData,
      `creances-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport créances:", error);
  }
};
