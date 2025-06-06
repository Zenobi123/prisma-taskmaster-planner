
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generateTachesReport = async () => {
  try {
    console.log("Génération du rapport des tâches...");
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        collaborateurs!tasks_collaborateur_id_fkey(nom, prenom),
        clients!tasks_client_id_fkey(nom, raisonsociale)
      `);

    if (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      throw error;
    }

    console.log("Tâches récupérées:", tasks?.length || 0);

    const reportData = tasks?.map(t => ({
      titre: t.title || 'N/A',
      collaborateur: t.collaborateurs ? `${t.collaborateurs.prenom || ''} ${t.collaborateurs.nom || ''}`.trim() : 'N/A',
      client: t.clients?.nom || t.clients?.raisonsociale || 'N/A',
      date_debut: t.start_date || 'N/A',
      date_fin: t.end_date || 'N/A',
      statut: t.status || 'en_attente',
      heure_debut: t.start_time || 'N/A',
      heure_fin: t.end_time || 'N/A'
    })) || [];

    console.log("Données tâches préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport des Tâches",
      reportData,
      `taches-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport tâches:", error);
    throw error;
  }
};

export const generatePerformanceCollaborateursReport = async () => {
  try {
    console.log("Génération du rapport performance collaborateurs...");
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        status,
        collaborateur_id,
        collaborateurs!tasks_collaborateur_id_fkey(nom, prenom, poste)
      `);

    if (error) {
      console.error("Erreur lors de la récupération des performances:", error);
      throw error;
    }

    console.log("Données de performance récupérées:", tasks?.length || 0);

    // Grouper par collaborateur
    const perfData = tasks?.reduce((acc, t) => {
      const collabId = t.collaborateur_id;
      if (!acc[collabId]) {
        acc[collabId] = {
          nom: t.collaborateurs ? `${t.collaborateurs.prenom || ''} ${t.collaborateurs.nom || ''}`.trim() : 'N/A',
          poste: t.collaborateurs?.poste || 'N/A',
          total_taches: 0,
          taches_terminees: 0,
          taches_en_cours: 0,
          taches_en_attente: 0,
          taux_completion: 0
        };
      }
      
      acc[collabId].total_taches++;
      
      switch (t.status) {
        case 'terminée':
          acc[collabId].taches_terminees++;
          break;
        case 'en_cours':
          acc[collabId].taches_en_cours++;
          break;
        case 'en_attente':
          acc[collabId].taches_en_attente++;
          break;
      }
      
      return acc;
    }, {} as any) || {};

    // Calculer les taux de completion
    Object.values(perfData).forEach((collab: any) => {
      collab.taux_completion = collab.total_taches > 0 
        ? Math.round((collab.taches_terminees / collab.total_taches) * 100)
        : 0;
    });

    const reportData = Object.values(perfData);

    console.log("Données performance collaborateurs préparées:", reportData.length, "éléments");

    exportToPdf(
      "Rapport Performance Collaborateurs",
      reportData,
      `performance-collaborateurs-${new Date().toISOString().slice(0, 7)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport performance:", error);
    throw error;
  }
};
