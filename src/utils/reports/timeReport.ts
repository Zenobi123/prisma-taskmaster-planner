
import { ReportDataService } from './reportDataService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateTimeReport() {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Analyse des Temps par Projet', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Analyser les tâches par client/projet
    const tempsParProjet = data.tasks.reduce((acc: any, tache: any) => {
      const projet = tache.clients?.nom || tache.clients?.raisonsociale || 'Projet sans client';
      if (!acc[projet]) {
        acc[projet] = {
          taches: 0,
          terminees: 0,
          collaborateurs: new Set(),
          progression: 0
        };
      }
      
      acc[projet].taches++;
      if (tache.status === 'terminée') acc[projet].terminees++;
      if (tache.collaborateur_id) acc[projet].collaborateurs.add(tache.collaborateur_id);
      
      acc[projet].progression = acc[projet].taches > 0 
        ? (acc[projet].terminees / acc[projet].taches) * 100 
        : 0;
      
      return acc;
    }, {});
    
    const timeData = Object.entries(tempsParProjet).map(([projet, data]: [string, any]) => [
      projet,
      data.taches.toString(),
      data.collaborateurs.size.toString(),
      `${data.progression.toFixed(0)}%`
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Projet', 'Nb Tâches', 'Collaborateurs', 'Progression']],
      body: timeData,
      theme: 'grid'
    });
    
    doc.save(`rapport-temps-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport de temps:', error);
  }
}
