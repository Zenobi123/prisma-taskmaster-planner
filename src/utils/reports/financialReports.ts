
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generateChiffresAffairesReport = async () => {
  try {
    console.log("Génération du rapport chiffre d'affaires...");
    
    const { data: factures, error } = await supabase
      .from('factures')
      .select('*')
      .eq('status', 'envoyée');

    if (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      throw error;
    }

    console.log("Factures récupérées:", factures?.length || 0);

    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthFactures = factures?.filter(f => {
        const factureDate = new Date(f.date);
        return factureDate.getFullYear() === currentYear && factureDate.getMonth() + 1 === month;
      }) || [];
      
      const totalMonth = monthFactures.reduce((sum, f) => sum + (f.montant || 0), 0);
      const paidMonth = monthFactures.reduce((sum, f) => sum + (f.montant_paye || 0), 0);
      
      return {
        mois: `${month}/${currentYear}`,
        chiffre_affaires: totalMonth,
        encaissements: paidMonth,
        en_attente: totalMonth - paidMonth
      };
    });

    console.log("Données mensuelles préparées:", monthlyData);

    exportToPdf(
      "Rapport Chiffre d'Affaires",
      monthlyData,
      `chiffre-affaires-${currentYear}`
    );
  } catch (error) {
    console.error("Erreur génération rapport CA:", error);
    throw error;
  }
};

export const generateFacturationReport = async () => {
  try {
    console.log("Génération du rapport de facturation...");
    
    const { data: factures, error } = await supabase
      .from('factures')
      .select(`
        *,
        clients(nom, raisonsociale)
      `);

    if (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      throw error;
    }

    console.log("Factures avec clients récupérées:", factures?.length || 0);

    const reportData = factures?.map(f => ({
      numero_facture: f.id,
      client: f.clients?.nom || f.clients?.raisonsociale || 'N/A',
      date_emission: f.date,
      montant: f.montant || 0,
      montant_paye: f.montant_paye || 0,
      statut: f.status_paiement || 'non_payée',
      echeance: f.echeance
    })) || [];

    console.log("Données de rapport préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport de Facturation",
      reportData,
      `facturation-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport facturation:", error);
    throw error;
  }
};

export const generateCreancesReport = async () => {
  try {
    console.log("Génération du rapport des créances...");
    
    const { data: factures, error } = await supabase
      .from('factures')
      .select(`
        *,
        clients(nom, raisonsociale, contact)
      `)
      .in('status_paiement', ['non_payée', 'partiellement_payée', 'en_retard']);

    if (error) {
      console.error("Erreur lors de la récupération des créances:", error);
      throw error;
    }

    console.log("Créances récupérées:", factures?.length || 0);

    const reportData = factures?.map(f => {
      const solde = (f.montant || 0) - (f.montant_paye || 0);
      const today = new Date();
      const echeance = new Date(f.echeance);
      const joursRetard = Math.max(0, Math.floor((today.getTime() - echeance.getTime()) / (1000 * 60 * 60 * 24)));
      const contact = f.clients?.contact as any;
      
      return {
        client: f.clients?.nom || f.clients?.raisonsociale || 'N/A',
        facture: f.id,
        montant_du: solde,
        echeance: f.echeance,
        jours_retard: joursRetard,
        telephone: contact?.telephone || 'N/A'
      };
    }).filter(f => f.montant_du > 0) || [];

    console.log("Données de créances filtrées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport des Créances",
      reportData,
      `creances-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport créances:", error);
    throw error;
  }
};
