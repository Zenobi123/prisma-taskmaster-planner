
import { ReportDataService } from './reportDataService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generatePersonnesMoralesReport() {
  try {
    console.log('Début génération du rapport personnes morales...');
    const data = await ReportDataService.getAllReportData();
    console.log('Données récupérées:', data);
    
    const personnesMorales = data.clients.filter(client => client.type === 'morale');
    console.log('Personnes morales trouvées:', personnesMorales.length);
    
    const doc = new jsPDF();
    
    // En-tête du rapport
    doc.setFontSize(18);
    doc.text('Rapport - Clients Personnes Morales', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${personnesMorales.length} clients`, 14, 36);
    
    // Données du tableau
    const tableData = personnesMorales.map(client => [
      client.raisonsociale || '',
      client.niu || '',
      client.regimefiscal || '',
      client.secteuractivite || '',
      client.centrerattachement || '',
      client.statut || ''
    ]);
    
    // Génération du tableau
    (doc as any).autoTable({
      startY: 45,
      head: [['Raison Sociale', 'NIU', 'Régime Fiscal', 'Secteur', 'Centre', 'Statut']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    // Téléchargement du fichier avec vérification
    const filename = `personnes-morales-${new Date().toISOString().slice(0, 10)}.pdf`;
    console.log('Tentative de téléchargement du fichier:', filename);
    
    // Force le téléchargement
    try {
      doc.save(filename);
      console.log('Téléchargement initié avec succès');
      
      // Attendre un peu pour que le téléchargement se lance
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`Rapport généré et téléchargé: ${filename}`);
      return true;
    } catch (downloadError) {
      console.error('Erreur lors du téléchargement:', downloadError);
      throw new Error('Impossible de télécharger le fichier PDF');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du rapport personnes morales:', error);
    throw error;
  }
}

export async function generatePersonnesPhysiquesReport() {
  try {
    console.log('Début génération du rapport personnes physiques...');
    const data = await ReportDataService.getAllReportData();
    const personnesPhysiques = data.clients.filter(client => client.type === 'physique');
    console.log('Personnes physiques trouvées:', personnesPhysiques.length);
    
    const doc = new jsPDF();
    
    // En-tête du rapport
    doc.setFontSize(18);
    doc.text('Rapport - Clients Personnes Physiques', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${personnesPhysiques.length} clients`, 14, 36);
    
    // Données du tableau
    const tableData = personnesPhysiques.map(client => [
      client.nom || '',
      client.niu || '',
      client.regimefiscal || '',
      client.secteuractivite || '',
      client.centrerattachement || '',
      client.statut || ''
    ]);
    
    // Génération du tableau
    (doc as any).autoTable({
      startY: 45,
      head: [['Nom', 'NIU', 'Régime Fiscal', 'Secteur', 'Centre', 'Statut']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    // Téléchargement du fichier
    const filename = `personnes-physiques-${new Date().toISOString().slice(0, 10)}.pdf`;
    console.log('Tentative de téléchargement:', filename);
    
    try {
      doc.save(filename);
      console.log('Téléchargement initié avec succès');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`Rapport généré et téléchargé: ${filename}`);
      return true;
    } catch (downloadError) {
      console.error('Erreur lors du téléchargement:', downloadError);
      throw new Error('Impossible de télécharger le fichier PDF');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du rapport personnes physiques:', error);
    throw error;
  }
}

export async function generateClientsParCentreReport() {
  try {
    console.log('Début génération du rapport clients par centre...');
    const data = await ReportDataService.getAllReportData();
    
    // Regrouper les clients par centre de rattachement
    const clientsParCentre = data.clients.reduce((acc: any, client) => {
      const centre = client.centrerattachement || 'Non défini';
      if (!acc[centre]) {
        acc[centre] = [];
      }
      acc[centre].push(client);
      return acc;
    }, {});
    
    console.log('Centres trouvés:', Object.keys(clientsParCentre));
    
    const doc = new jsPDF();
    
    // En-tête du rapport
    doc.setFontSize(18);
    doc.text('Rapport - Clients par Centre des Impôts', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    let yPosition = 45;
    
    // Pour chaque centre
    Object.entries(clientsParCentre).forEach(([centre, clients]: [string, any]) => {
      // Titre du centre
      doc.setFontSize(12);
      doc.text(`Centre: ${centre} (${clients.length} clients)`, 14, yPosition);
      yPosition += 10;
      
      // Données du tableau pour ce centre
      const tableData = clients.map((client: any) => [
        client.type === 'physique' ? client.nom : client.raisonsociale,
        client.niu || '',
        client.type === 'physique' ? 'Personne Physique' : 'Personne Morale',
        client.regimefiscal || ''
      ]);
      
      // Génération du tableau
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Nom/Raison Sociale', 'NIU', 'Type', 'Régime Fiscal']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
      
      // Nouvelle page si nécessaire
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Téléchargement du fichier
    const filename = `clients-par-centre-${new Date().toISOString().slice(0, 10)}.pdf`;
    console.log('Tentative de téléchargement:', filename);
    
    try {
      doc.save(filename);
      console.log('Téléchargement initié avec succès');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`Rapport généré et téléchargé: ${filename}`);
      return true;
    } catch (downloadError) {
      console.error('Erreur lors du téléchargement:', downloadError);
      throw new Error('Impossible de télécharger le fichier PDF');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients par centre:', error);
    throw error;
  }
}

export async function generateClientsAssujettisIGSReport() {
  try {
    console.log('Début génération du rapport clients IGS...');
    const data = await ReportDataService.getAllReportData();
    // Les clients assujettis à l'IGS sont ceux du régime "igs"
    const clientsIGS = data.clients.filter(client => {
      const regime = client.regimefiscal?.toLowerCase();
      return regime === 'igs';
    });
    
    console.log(`Clients IGS trouvés: ${clientsIGS.length}`);
    
    const doc = new jsPDF();
    
    // En-tête du rapport
    doc.setFontSize(18);
    doc.text('Rapport - Clients Assujettis IGS', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${clientsIGS.length} clients assujettis à l'IGS`, 14, 36);
    
    // Données du tableau
    const tableData = clientsIGS.map(client => [
      client.type === 'physique' ? client.nom : client.raisonsociale,
      client.niu || '',
      client.type === 'physique' ? 'Personne Physique' : 'Personne Morale',
      client.secteuractivite || '',
      client.centrerattachement || '',
      client.statut || ''
    ]);
    
    // Génération du tableau
    (doc as any).autoTable({
      startY: 45,
      head: [['Nom/Raison Sociale', 'NIU', 'Type', 'Secteur', 'Centre', 'Statut']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    // Téléchargement du fichier
    const filename = `clients-assujettis-igs-${new Date().toISOString().slice(0, 10)}.pdf`;
    console.log('Tentative de téléchargement:', filename);
    
    try {
      doc.save(filename);
      console.log('Téléchargement initié avec succès');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`Rapport généré et téléchargé: ${filename}`);
      return true;
    } catch (downloadError) {
      console.error('Erreur lors du téléchargement:', downloadError);
      throw new Error('Impossible de télécharger le fichier PDF');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients IGS:', error);
    throw error;
  }
}

export async function generateClientsAssujettsPatenteReport() {
  try {
    console.log('Début génération du rapport clients Patente...');
    const data = await ReportDataService.getAllReportData();
    
    // Les clients assujettis à la Patente sont ceux du régime "reel" 
    const clientsPatente = data.clients.filter(client => {
      const regime = client.regimefiscal?.toLowerCase();
      return regime === 'reel' || regime === 'réel';
    });
    
    console.log(`Clients Patente trouvés: ${clientsPatente.length}`);
    console.log('Régimes fiscaux trouvés:', data.clients.map(c => c.regimefiscal).filter(Boolean));
    
    const doc = new jsPDF();
    
    // En-tête du rapport
    doc.setFontSize(18);
    doc.text('Rapport - Clients Assujettis Patente', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${clientsPatente.length} clients assujettis à la Patente`, 14, 36);
    
    // Données du tableau
    const tableData = clientsPatente.map(client => [
      client.type === 'physique' ? client.nom : client.raisonsociale,
      client.niu || '',
      client.type === 'physique' ? 'Personne Physique' : 'Personne Morale',
      client.secteuractivite || '',
      client.centrerattachement || '',
      client.statut || ''
    ]);
    
    // Génération du tableau
    (doc as any).autoTable({
      startY: 45,
      head: [['Nom/Raison Sociale', 'NIU', 'Type', 'Secteur', 'Centre', 'Statut']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    // Téléchargement du fichier
    const filename = `clients-assujettis-patente-${new Date().toISOString().slice(0, 10)}.pdf`;
    console.log('Tentative de téléchargement:', filename);
    
    try {
      doc.save(filename);
      console.log('Téléchargement initié avec succès');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`Rapport généré et téléchargé: ${filename}`);
      return true;
    } catch (downloadError) {
      console.error('Erreur lors du téléchargement:', downloadError);
      throw new Error('Impossible de télécharger le fichier PDF');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients Patente:', error);
    throw error;
  }
}
