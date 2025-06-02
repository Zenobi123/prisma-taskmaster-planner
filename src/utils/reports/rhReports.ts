
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generateMassSalarialeReport = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    const { data: paie, error } = await supabase
      .from('paie')
      .select(`
        *,
        employes(nom, prenom, poste, client_id),
        employes!inner(clients(nom, raisonsociale))
      `)
      .eq('annee', currentYear);

    if (error) throw error;

    const reportData = paie?.map(p => ({
      employe: `${p.employes?.prenom} ${p.employes?.nom}`,
      client: p.employes?.clients?.nom || p.employes?.clients?.raisonsociale || 'N/A',
      poste: p.employes?.poste || 'N/A',
      mois: `${p.mois}/${p.annee}`,
      salaire_brut: p.salaire_brut,
      cnps_employe: p.cnps_employe || 0,
      cnps_employeur: p.cnps_employeur || 0,
      irpp: p.irpp || 0,
      salaire_net: p.salaire_net
    })) || [];

    exportToPdf(
      "Rapport Masse Salariale",
      reportData,
      `masse-salariale-${currentYear}`
    );
  } catch (error) {
    console.error("Erreur génération rapport masse salariale:", error);
  }
};

export const generateEffectifsReport = async () => {
  try {
    const { data: employes, error } = await supabase
      .from('employes')
      .select(`
        *,
        clients(nom, raisonsociale)
      `);

    if (error) throw error;

    const reportData = employes?.map(e => ({
      nom_complet: `${e.prenom} ${e.nom}`,
      client: e.clients?.nom || e.clients?.raisonsociale || 'N/A',
      poste: e.poste,
      date_embauche: e.date_embauche,
      salaire_base: e.salaire_base,
      statut: e.statut,
      type_contrat: e.type_contrat || 'N/A',
      numero_cnps: e.numero_cnps || 'N/A'
    })) || [];

    exportToPdf(
      "Rapport des Effectifs",
      reportData,
      `effectifs-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport effectifs:", error);
  }
};
