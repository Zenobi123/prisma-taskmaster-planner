
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
      ['Total Salaire Brut', `${stats.totalSalaireBrut.toLocaleString()} F CFA`],
      ['Total Salaire Net', `${stats.totalSalaireNet.toLocaleString()} F CFA`],
      ['Total Retenues', `${stats.totalRetenues.toLocaleString()} F CFA`],
      ['Nombre de Bulletins', stats.nombreBulletins.toString()]
    ];
    
    autoTable(doc, {
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: summaryData,
      theme: 'grid'
    });
    
    // Détail par client
    const masseSalarialeParClient = data.employes.reduce((acc, employe) => {
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
      const paieEmploye = data.paie.filter((p) => p.employe_id === employe.id);
      paieEmploye.forEach((p) => {
        acc[clientNom].totalSalaireBrut += p.salaire_brut || 0;
        acc[clientNom].totalSalaireNet += p.salaire_net || 0;
      });
      
      return acc;
    }, {});
    
    const currentY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Répartition par Client', 14, currentY);
    
    const clientsData = Object.entries(masseSalarialeParClient).map(([client, data]: [string, { nombreEmployes: number; totalSalaireBrut: number; totalSalaireNet: number }]) => [
      client,
      data.nombreEmployes.toString(),
      `${data.totalSalaireBrut.toLocaleString()} F CFA`,
      `${data.totalSalaireNet.toLocaleString()} F CFA`
    ]);
    
    autoTable(doc, {
      startY: currentY + 10,
      head: [['Client', 'Nb Employés', 'Total Brut', 'Total Net']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 9 }
    });
    
    doc.save(`masse-salariale-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch { /* erreur ignoree volontairement */ }
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
    const employesActifs = data.employes.filter((e) => e.statut === 'Actif').length;
    const employesInactifs = totalEmployes - employesActifs;
    
    const statsData = [
      ['Total Employés', totalEmployes.toString()],
      ['Employés Actifs', employesActifs.toString()],
      ['Employés Inactifs', employesInactifs.toString()]
    ];
    
    autoTable(doc, {
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: statsData,
      theme: 'grid'
    });
    
    // Détail des employés par client
    const effectifsParClient = data.employes.reduce((acc, employe) => {
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
    
    const currentY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Effectifs par Client', 14, currentY);
    
    const effectifsData = Object.entries(effectifsParClient).map(([client, data]: [string, { total: number; actifs: number; inactifs: number }]) => [
      client,
      data.total.toString(),
      data.actifs.toString(),
      data.inactifs.toString()
    ]);
    
    autoTable(doc, {
      startY: currentY + 10,
      head: [['Client', 'Total', 'Actifs', 'Inactifs']],
      body: effectifsData,
      theme: 'grid'
    });
    
    doc.save(`effectifs-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch { /* erreur ignoree volontairement */ }
};
