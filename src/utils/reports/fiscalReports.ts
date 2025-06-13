
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

export const generateObligationsFiscalesReport = async () => {
  try {
    const fiscalData = await ReportDataService.getFiscalObligationsData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Obligations Fiscales', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Résumé des obligations
    const summaryData = [
      ['IGS non payées', fiscalData.unpaidIgs.length.toString()],
      ['Patente non payée', fiscalData.unpaidPatente.length.toString()],
      ['DSF non déposées', fiscalData.unfiledDsf.length.toString()],
      ['DARP non déposées', fiscalData.unfiledDarp.length.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Type d\'Obligation', 'Nombre de Clients']],
      body: summaryData,
      theme: 'grid'
    });
    
    // Détail IGS non payées
    if (fiscalData.unpaidIgs.length > 0) {
      let currentY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text('IGS Non Payées', 14, currentY);
      
      const igsData = fiscalData.unpaidIgs.map((client: any) => [
        client.nom || client.raisonsociale || 'Client inconnu',
        client.niu || 'Non renseigné',
        client.regimefiscal || 'Non défini'
      ]);
      
      (doc as any).autoTable({
        startY: currentY + 10,
        head: [['Client', 'NIU', 'Régime Fiscal']],
        body: igsData,
        theme: 'grid',
        styles: { fontSize: 9 }
      });
    }
    
    // Détail DSF non déposées
    if (fiscalData.unfiledDsf.length > 0) {
      let currentY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text('DSF Non Déposées', 14, currentY);
      
      const dsfData = fiscalData.unfiledDsf.map((client: any) => [
        client.nom || client.raisonsociale || 'Client inconnu',
        client.niu || 'Non renseigné',
        client.type || 'Non défini'
      ]);
      
      (doc as any).autoTable({
        startY: currentY + 10,
        head: [['Client', 'NIU', 'Type']],
        body: dsfData,
        theme: 'grid',
        styles: { fontSize: 9 }
      });
    }
    
    doc.save(`obligations-fiscales-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generateRetardsFiscauxReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les obligations en retard
    const obligationsEnRetard = data.fiscalObligations.filter((o: any) => {
      if (!o.date_echeance) return false;
      const echeance = new Date(o.date_echeance);
      const maintenant = new Date();
      
      if (o.type_obligation.includes('paiement')) {
        return !o.paye && echeance < maintenant;
      } else {
        return !o.depose && echeance < maintenant;
      }
    });
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Retards Fiscaux', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    const retardsData = obligationsEnRetard.map((obligation: any) => {
      const joursRetard = Math.floor((new Date().getTime() - new Date(obligation.date_echeance).getTime()) / (1000 * 60 * 60 * 24));
      
      return [
        obligation.clients?.nom || obligation.clients?.raisonsociale || 'Client inconnu',
        obligation.type_obligation || 'Non défini',
        obligation.periode || 'Non définie',
        new Date(obligation.date_echeance).toLocaleDateString(),
        `${joursRetard} jours`
      ];
    });
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Client', 'Type Obligation', 'Période', 'Échéance', 'Retard']],
      body: retardsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`retards-fiscaux-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};
