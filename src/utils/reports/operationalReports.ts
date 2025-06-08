
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

export const generateTachesReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Suivi des Tâches', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Statistiques des tâches
    const totalTaches = data.tasks.length;
    const tachesTerminees = data.tasks.filter((t: any) => t.status === 'terminée').length;
    const tachesEnCours = data.tasks.filter((t: any) => t.status === 'en_cours').length;
    const tachesEnAttente = data.tasks.filter((t: any) => t.status === 'en_attente').length;
    
    const statsData = [
      ['Total Tâches', totalTaches.toString()],
      ['Terminées', tachesTerminees.toString()],
      ['En Cours', tachesEnCours.toString()],
      ['En Attente', tachesEnAttente.toString()],
      ['Taux de Completion', `${totalTaches > 0 ? ((tachesTerminees / totalTaches) * 100).toFixed(1) : 0}%`]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: statsData,
      theme: 'grid'
    });
    
    // Détail des tâches par collaborateur
    const tachesParCollaborateur = data.tasks.reduce((acc: any, tache: any) => {
      const collaborateur = `${tache.collaborateurs?.prenom || ''} ${tache.collaborateurs?.nom || 'Collaborateur inconnu'}`.trim();
      if (!acc[collaborateur]) {
        acc[collaborateur] = {
          total: 0,
          terminees: 0,
          enCours: 0,
          enAttente: 0
        };
      }
      
      acc[collaborateur].total++;
      if (tache.status === 'terminée') acc[collaborateur].terminees++;
      else if (tache.status === 'en_cours') acc[collaborateur].enCours++;
      else if (tache.status === 'en_attente') acc[collaborateur].enAttente++;
      
      return acc;
    }, {});
    
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Tâches par Collaborateur', 14, currentY);
    
    const collaborateursData = Object.entries(tachesParCollaborateur).map(([collaborateur, data]: [string, any]) => [
      collaborateur,
      data.total.toString(),
      data.terminees.toString(),
      data.enCours.toString(),
      data.enAttente.toString()
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 10,
      head: [['Collaborateur', 'Total', 'Terminées', 'En Cours', 'En Attente']],
      body: collaborateursData,
      theme: 'grid',
      styles: { fontSize: 9 }
    });
    
    doc.save(`taches-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generatePerformanceCollaborateursReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Performance Collaborateurs', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Calculer les performances par collaborateur
    const performanceParCollaborateur = data.tasks.reduce((acc: any, tache: any) => {
      const collaborateur = `${tache.collaborateurs?.prenom || ''} ${tache.collaborateurs?.nom || 'Collaborateur inconnu'}`.trim();
      if (!acc[collaborateur]) {
        acc[collaborateur] = {
          totalTaches: 0,
          tachesTerminees: 0,
          tauxCompletion: 0,
          tachesEnRetard: 0
        };
      }
      
      acc[collaborateur].totalTaches++;
      if (tache.status === 'terminée') {
        acc[collaborateur].tachesTerminees++;
      }
      
      // Vérifier si la tâche est en retard
      if (tache.end_date && new Date(tache.end_date) < new Date() && tache.status !== 'terminée') {
        acc[collaborateur].tachesEnRetard++;
      }
      
      acc[collaborateur].tauxCompletion = acc[collaborateur].totalTaches > 0 
        ? (acc[collaborateur].tachesTerminees / acc[collaborateur].totalTaches) * 100 
        : 0;
      
      return acc;
    }, {});
    
    const performanceData = Object.entries(performanceParCollaborateur).map(([collaborateur, data]: [string, any]) => [
      collaborateur,
      data.totalTaches.toString(),
      data.tachesTerminees.toString(),
      `${data.tauxCompletion.toFixed(1)}%`,
      data.tachesEnRetard.toString()
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Collaborateur', 'Total Tâches', 'Terminées', 'Taux Completion', 'En Retard']],
      body: performanceData,
      theme: 'grid'
    });
    
    doc.save(`performance-collaborateurs-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};
