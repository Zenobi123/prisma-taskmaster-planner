
import { ReportDataService } from './reportDataService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateClientReport() {
  try {
    const data = await ReportDataService.getAllReportData();
    const stats = ReportDataService.calculateClientStats(data.clients);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Client Global', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Statistiques générales
    const clientStats = [
      ['Total Clients', stats.total.toString()],
      ['Personnes Physiques', stats.personnesPhysiques.toString()],
      ['Personnes Morales', stats.personnesMorales.toString()],
      ['Gestion Externalisée', stats.gestionExternalisee.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Type', 'Nombre']],
      body: clientStats,
      theme: 'grid'
    });
    
    doc.save(`rapport-client-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport client:', error);
  }
}
