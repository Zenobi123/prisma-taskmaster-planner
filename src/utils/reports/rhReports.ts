
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

export const generateMassSalarialeReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    const stats = ReportDataService.calculatePayrollStats(data.paie);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Masse Salariale', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Résumé global
    const summaryData = [
      ['Total Salaire Brut', `${stats.totalSalaireBrut.toLocaleString()} FCFA`],
      ['Total Salaire Net', `${stats.totalSalaireNet.toLocaleString()} FCFA`],
      ['Total Retenues', `${stats.totalRetenues.toLocaleString()} FCFA`],
      ['Nombre de Bulletins', stats.nombreBulletins.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: summaryData,
      theme: 'grid'
    });
    
    // Détail par client
    const masseSalarialeParClient = data.employes.reduce((acc: any, employe: any) => {
      const clientNom = employe.clients?.nom || employe.clients?.raisonsociale || 'Client inconnu';
      if (!acc[clientNom]) {
        acc[clientNom] = {
          nombreEmployes: 0,
          totalSalaireBrut: 0,
          totalSalaireNet: 0
        };
      }
      
      acc[clientNom].nombreEmployes++;
      
      // Calculer les totaux de paie pour cet employé
      const paieEmploye = data.paie.filter((p: any) => p.employe_id === employe.id);
      paieEmploye.forEach((p: any) => {
        acc[clientNom].totalSalaireBrut += p.salaire_brut || 0;
        acc[clientNom].totalSalaireNet += p.salaire_net || 0;
      });
      
      return acc;
    }, {});
    
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Répartition par Client', 14, currentY);
    
    const clientsData = Object.entries(masseSalarialeParClient).map(([client, data]: [string, any]) => [
      client,
      data.nombreEmployes.toString(),
      `${data.totalSalaireBrut.toLocaleString()} FCFA`,
      `${data.totalSalaireNet.toLocaleString()} FCFA`
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 10,
      head: [['Client', 'Nb Employés', 'Total Brut', 'Total Net']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 9 }
    });
    
    doc.save(`masse-salariale-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generateEffectifsReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport des Effectifs', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Statistiques générales
    const totalEmployes = data.employes.length;
    const employesActifs = data.employes.filter((e: any) => e.statut === 'Actif').length;
    const employesInactifs = totalEmployes - employesActifs;
    
    const statsData = [
      ['Total Employés', totalEmployes.toString()],
      ['Employés Actifs', employesActifs.toString()],
      ['Employés Inactifs', employesInactifs.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: statsData,
      theme: 'grid'
    });
    
    // Détail des employés par client
    const effectifsParClient = data.employes.reduce((acc: any, employe: any) => {
      const clientNom = employe.clients?.nom || employe.clients?.raisonsociale || 'Client inconnu';
      if (!acc[clientNom]) {
        acc[clientNom] = {
          actifs: 0,
          inactifs: 0,
          total: 0
        };
      }
      
      acc[clientNom].total++;
      if (employe.statut === 'Actif') {
        acc[clientNom].actifs++;
      } else {
        acc[clientNom].inactifs++;
      }
      
      return acc;
    }, {});
    
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Effectifs par Client', 14, currentY);
    
    const effectifsData = Object.entries(effectifsParClient).map(([client, data]: [string, any]) => [
      client,
      data.total.toString(),
      data.actifs.toString(),
      data.inactifs.toString()
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 10,
      head: [['Client', 'Total', 'Actifs', 'Inactifs']],
      body: effectifsData,
      theme: 'grid'
    });
    
    doc.save(`effectifs-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};
