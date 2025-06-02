
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generateMassSalarialeReport = async () => {
  try {
    console.log("Génération du rapport masse salariale...");
    
    const currentYear = new Date().getFullYear();
    
    const { data: paie, error } = await supabase
      .from('paie')
      .select(`
        *,
        employes(nom, prenom, poste, client_id),
        employes!inner(clients(nom, raisonsociale))
      `)
      .eq('annee', currentYear);

    if (error) {
      console.error("Erreur lors de la récupération de la masse salariale:", error);
      throw error;
    }

    console.log("Données de paie récupérées:", paie?.length || 0);

    const reportData = paie?.map(p => ({
      employe: `${p.employes?.prenom || ''} ${p.employes?.nom || ''}`.trim(),
      client: p.employes?.clients?.nom || p.employes?.clients?.raisonsociale || 'N/A',
      poste: p.employes?.poste || 'N/A',
      mois: `${p.mois}/${p.annee}`,
      salaire_brut: p.salaire_brut || 0,
      cnps_employe: p.cnps_employe || 0,
      cnps_employeur: p.cnps_employeur || 0,
      irpp: p.irpp || 0,
      salaire_net: p.salaire_net || 0
    })) || [];

    console.log("Données masse salariale préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport Masse Salariale",
      reportData,
      `masse-salariale-${currentYear}`
    );
  } catch (error) {
    console.error("Erreur génération rapport masse salariale:", error);
    throw error;
  }
};

export const generateEffectifsReport = async () => {
  try {
    console.log("Génération du rapport effectifs...");
    
    const { data: employes, error } = await supabase
      .from('employes')
      .select(`
        *,
        clients(nom, raisonsociale)
      `);

    if (error) {
      console.error("Erreur lors de la récupération des effectifs:", error);
      throw error;
    }

    console.log("Effectifs récupérés:", employes?.length || 0);

    const reportData = employes?.map(e => ({
      nom_complet: `${e.prenom || ''} ${e.nom || ''}`.trim(),
      client: e.clients?.nom || e.clients?.raisonsociale || 'N/A',
      poste: e.poste || 'N/A',
      date_embauche: e.date_embauche || 'N/A',
      salaire_base: e.salaire_base || 0,
      statut: e.statut || 'Actif',
      type_contrat: e.type_contrat || 'N/A',
      numero_cnps: e.numero_cnps || 'N/A'
    })) || [];

    console.log("Données effectifs préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport des Effectifs",
      reportData,
      `effectifs-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport effectifs:", error);
    throw error;
  }
};
