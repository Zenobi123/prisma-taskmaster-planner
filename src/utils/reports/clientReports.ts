
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

export const generatePortefeuilleClientsReport = async () => {
  try {
    console.log('Génération du rapport portefeuille clients...');
    const data = await ReportDataService.getAllReportData();
    const stats = ReportDataService.calculateClientStats(data.clients);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Portefeuille Clients', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Statistiques générales
    const statsData = [
      ['Total Clients', stats.total.toString()],
      ['Personnes Physiques', stats.personnesPhysiques.toString()],
      ['Personnes Morales', stats.personnesMorales.toString()],
      ['Gestion Externalisée', stats.gestionExternalisee.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Indicateur', 'Valeur']],
      body: statsData,
      theme: 'grid'
    });
    
    // Liste des clients
    const finalY = (doc as any).lastAutoTable?.finalY || 80;
    let currentY = finalY + 20;
    doc.setFontSize(14);
    doc.text('Liste des Clients Actifs', 14, currentY);
    
    const clientsData = data.clients.map((client: any) => [
      client.nom || client.raisonsociale || 'Sans nom',
      client.type || 'Non défini',
      client.regimefiscal || 'Non défini',
      client.centrerattachement || 'Non défini',
      client.gestionexternalisee ? 'Oui' : 'Non'
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 10,
      head: [['Nom/Raison Sociale', 'Type', 'Régime Fiscal', 'Centre', 'Gestion Ext.']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    console.log('Téléchargement du rapport...');
    doc.save(`portefeuille-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport téléchargé avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export const generateNouveauxClientsReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les clients créés dans les 6 derniers mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const nouveauxClients = data.clients.filter((client: any) => 
      new Date(client.created_at) >= sixMonthsAgo
    );
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Nouveaux Clients (6 derniers mois)', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    const nouveauxClientsData = nouveauxClients.map((client: any) => [
      client.nom || client.raisonsociale || 'Sans nom',
      client.type || 'Non défini',
      new Date(client.created_at).toLocaleDateString(),
      client.centrerattachement || 'Non défini'
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Nom/Raison Sociale', 'Type', 'Date Création', 'Centre']],
      body: nouveauxClientsData,
      theme: 'grid'
    });
    
    doc.save(`nouveaux-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export const generateActiviteClientsReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Calculer l'activité par client (nombre de factures, montant total)
    const activiteParClient = data.clients.map((client: any) => {
      const facturesClient = data.factures.filter((f: any) => f.client_id === client.id);
      const paiementsClient = data.paiements.filter((p: any) => p.client_id === client.id);
      
      const totalFactures = facturesClient.reduce((sum: number, f: any) => sum + (Number(f.montant) || 0), 0);
      const totalPaiements = paiementsClient.reduce((sum: number, p: any) => sum + (Number(p.montant) || 0), 0);
      
      return {
        nom: client.nom || client.raisonsociale || 'Sans nom',
        nombreFactures: facturesClient.length,
        totalFactures,
        totalPaiements,
        solde: totalPaiements - totalFactures
      };
    }).filter(client => client.nombreFactures > 0);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Activité par Client', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    const activiteData = activiteParClient.map((client: any) => [
      client.nom,
      client.nombreFactures.toString(),
      `${client.totalFactures.toLocaleString()} FCFA`,
      `${client.totalPaiements.toLocaleString()} FCFA`,
      `${client.solde.toLocaleString()} FCFA`
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Client', 'Nb Factures', 'Total Facturé', 'Total Payé', 'Solde']],
      body: activiteData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`activite-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};
