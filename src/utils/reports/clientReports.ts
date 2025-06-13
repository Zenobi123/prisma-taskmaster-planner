import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

// Fonction utilitaire pour formater les valeurs
const formatPropertyValue = (value: string | null | undefined): string => {
  if (!value) return 'Non renseigné';
  
  const lowerValue = value.toLowerCase();
  
  // Cas spéciaux pour les valeurs demandées
  if (lowerValue === 'reel') {
    return 'RÉEL';
  }
  if (lowerValue === 'sarl') {
    return 'SARL';
  }
  if (lowerValue === 'non_professionnel') {
    return 'NON-PROF';
  }
  if (lowerValue === 'igs') {
    return 'IGS';
  }
  
  // Capitaliser la première lettre pour les autres propriétés
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const generatePortefeuilleClientsReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Portefeuille Clients', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Statistiques générales
    const personnesMorales = data.clients.filter((c: any) => c.type === 'morale');
    const personnesPhysiques = data.clients.filter((c: any) => c.type === 'physique');
    
    const statsData = [
      ['Total Clients', data.clients.length.toString()],
      ['Personnes Morales', personnesMorales.length.toString()],
      ['Personnes Physiques', personnesPhysiques.length.toString()],
      ['Clients Actifs', data.clients.filter((c: any) => c.statut === 'actif').length.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Catégorie', 'Nombre']],
      body: statsData,
      theme: 'grid'
    });
    
    // Liste détaillée des clients
    const clientsData = data.clients.map((client: any) => [
      client.nom || client.raisonsociale || 'Sans nom',
      client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
      client.niu || 'Non renseigné',
      formatPropertyValue(client.regimefiscal),
      formatPropertyValue(client.secteuractivite),
      formatPropertyValue(client.statut)
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Régime Fiscal', 'Secteur', 'Statut']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`portefeuille-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generateNouveauxClientsReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les clients des 6 derniers mois
    const sixMoisAujourdhui = new Date();
    sixMoisAujourdhui.setMonth(sixMoisAujourdhui.getMonth() - 6);
    
    const nouveauxClients = data.clients.filter((client: any) => {
      if (!client.created_at) return false;
      const dateCreation = new Date(client.created_at);
      return dateCreation >= sixMoisAujourdhui;
    });
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Nouveaux Clients', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Période: 6 derniers mois (${nouveauxClients.length} clients)`, 14, 36);
    
    if (nouveauxClients.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun nouveau client sur cette période.', 14, 50);
    } else {
      const clientsData = nouveauxClients.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite),
        new Date(client.created_at).toLocaleDateString()
      ]);
      
      (doc as any).autoTable({
        startY: 45,
        head: [['Nom/Raison Sociale', 'Type', 'Régime Fiscal', 'Secteur', 'Date Création']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`nouveaux-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

export const generateActiviteClientsReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Activité par Client', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Analyser l'activité par secteur
    const activiteParSecteur = data.clients.reduce((acc: any, client: any) => {
      const secteur = formatPropertyValue(client.secteuractivite);
      if (!acc[secteur]) {
        acc[secteur] = [];
      }
      acc[secteur].push(client);
      return acc;
    }, {});
    
    let currentY = 40;
    
    Object.entries(activiteParSecteur).forEach(([secteur, clients]: [string, any]) => {
      // Titre du secteur
      doc.setFontSize(12);
      doc.text(`${secteur} (${clients.length} clients)`, 14, currentY);
      currentY += 10;
      
      const secteursData = clients.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        formatPropertyValue(client.regimefiscal),
        client.niu || 'Non renseigné'
      ]);
      
      (doc as any).autoTable({
        startY: currentY,
        head: [['Nom/Raison Sociale', 'Type', 'Régime Fiscal', 'NIU']],
        body: secteursData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Nouvelle page si nécessaire
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
    });
    
    doc.save(`activite-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};
