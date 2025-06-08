
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

export const generateChiffresAffairesReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    const stats = ReportDataService.calculateFinancialStats(data.factures, data.paiements);
    
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(18);
    doc.text('Rapport Chiffre d\'Affaires', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Résumé financier
    doc.setFontSize(14);
    doc.text('Résumé Financier', 14, 45);
    
    const summaryData = [
      ['Total Factures', `${stats.totalFactures.toLocaleString()} FCFA`],
      ['Total Paiements', `${stats.totalPaiements.toLocaleString()} FCFA`],
      ['Taux de Recouvrement', `${stats.tauxRecouvrement.toFixed(1)}%`],
      ['Factures Payées', stats.facuresPayees.toString()],
      ['Factures en Retard', stats.facturesEnRetard.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 55,
      head: [['Indicateur', 'Valeur']],
      body: summaryData,
      theme: 'grid'
    });
    
    // Détail des factures par mois
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Évolution Mensuelle', 14, currentY);
    
    // Grouper les factures par mois
    const facturesByMonth = data.factures.reduce((acc: any, facture: any) => {
      const month = new Date(facture.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      if (!acc[month]) acc[month] = { count: 0, amount: 0 };
      acc[month].count++;
      acc[month].amount += facture.montant || 0;
      return acc;
    }, {});
    
    const monthlyData = Object.entries(facturesByMonth).map(([month, data]: [string, any]) => [
      month,
      data.count.toString(),
      `${data.amount.toLocaleString()} FCFA`
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 10,
      head: [['Mois', 'Nombre de Factures', 'Montant Total']],
      body: monthlyData,
      theme: 'grid'
    });
    
    doc.save(`chiffre-affaires-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generateFacturationReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport de Facturation', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Tableau des factures
    const facturesData = data.factures.slice(0, 50).map((facture: any) => [
      facture.id,
      facture.clients?.nom || facture.clients?.raisonsociale || 'Client inconnu',
      new Date(facture.date).toLocaleDateString(),
      `${(facture.montant || 0).toLocaleString()} FCFA`,
      facture.status_paiement || 'Non défini'
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['N° Facture', 'Client', 'Date', 'Montant', 'Statut']],
      body: facturesData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`facturation-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generateCreancesReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les factures impayées
    const facturesImpayees = data.factures.filter((f: any) => 
      f.status_paiement === 'non_payée' || f.status_paiement === 'partiellement_payée'
    );
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport des Créances', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    const creancesData = facturesImpayees.map((facture: any) => {
      const montantRestant = (facture.montant || 0) - (facture.montant_paye || 0);
      const joursRetard = Math.floor((new Date().getTime() - new Date(facture.echeance).getTime()) / (1000 * 60 * 60 * 24));
      
      return [
        facture.clients?.nom || facture.clients?.raisonsociale || 'Client inconnu',
        facture.id,
        new Date(facture.echeance).toLocaleDateString(),
        `${montantRestant.toLocaleString()} FCFA`,
        joursRetard > 0 ? `${joursRetard} jours` : 'Non échu'
      ];
    });
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Client', 'N° Facture', 'Échéance', 'Montant Restant', 'Retard']],
      body: creancesData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`creances-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};
