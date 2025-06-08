
import { ReportDataService } from './reportDataService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateFinancialReport() {
  try {
    const data = await ReportDataService.getAllReportData();
    const stats = ReportDataService.calculateFinancialStats(data.factures, data.paiements);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Bilan Financier Trimestriel', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Indicateurs financiers principaux
    const financialData = [
      ['Total Facturé', `${stats.totalFactures.toLocaleString()} FCFA`],
      ['Total Encaissé', `${stats.totalPaiements.toLocaleString()} FCFA`],
      ['Taux de Recouvrement', `${stats.tauxRecouvrement.toFixed(1)}%`],
      ['Factures Payées', stats.facuresPayees.toString()],
      ['Factures en Retard', stats.facturesEnRetard.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: financialData,
      theme: 'grid'
    });
    
    doc.save(`bilan-financier-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport financier:', error);
  }
}
