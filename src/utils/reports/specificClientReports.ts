
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

export const generatePersonnesMoralesReport = async () => {
  try {
    console.log('Génération du rapport des personnes morales...');
    const data = await ReportDataService.getAllReportData();
    
    const personnesMorales = data.clients.filter(client => client.type === 'morale');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Personnes Morales', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${personnesMorales.length} clients`, 14, 36);
    
    const clientsData = personnesMorales.map((client: any) => [
      client.raisonsociale || 'Non renseigné',
      client.sigle || '',
      client.formejuridique || 'Non renseigné',
      client.niu || 'Non renseigné',
      client.centrerattachement || 'Non renseigné',
      client.regimefiscal || 'Non renseigné',
      client.secteuractivite || 'Non renseigné'
    ]);
    
    (doc as any).autoTable({
      startY: 45,
      head: [['Raison Sociale', 'Sigle', 'Forme Juridique', 'NIU', 'Centre', 'Régime Fiscal', 'Secteur']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`personnes-morales-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export const generatePersonnesPhysiquesReport = async () => {
  try {
    console.log('Génération du rapport des personnes physiques...');
    const data = await ReportDataService.getAllReportData();
    
    const personnesPhysiques = data.clients.filter(client => client.type === 'physique');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Personnes Physiques', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${personnesPhysiques.length} clients`, 14, 36);
    
    const clientsData = personnesPhysiques.map((client: any) => [
      client.nom || 'Non renseigné',
      client.sexe || 'Non renseigné',
      client.etatcivil || 'Non renseigné',
      client.niu || 'Non renseigné',
      client.centrerattachement || 'Non renseigné',
      client.regimefiscal || 'Non renseigné',
      client.secteuractivite || 'Non renseigné'
    ]);
    
    (doc as any).autoTable({
      startY: 45,
      head: [['Nom', 'Sexe', 'État Civil', 'NIU', 'Centre', 'Régime Fiscal', 'Secteur']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`personnes-physiques-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export const generateClientsParCentreReport = async () => {
  try {
    console.log('Génération du rapport par centre des impôts...');
    const data = await ReportDataService.getAllReportData();
    
    // Grouper les clients par centre
    const clientsParCentre = data.clients.reduce((acc: any, client: any) => {
      const centre = client.centrerattachement || 'Non renseigné';
      if (!acc[centre]) {
        acc[centre] = [];
      }
      acc[centre].push(client);
      return acc;
    }, {});
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients par Centre des Impôts', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    let currentY = 45;
    
    Object.keys(clientsParCentre).forEach((centre, index) => {
      const clients = clientsParCentre[centre];
      
      // Titre du centre
      doc.setFontSize(12);
      doc.text(`${centre} (${clients.length} clients)`, 14, currentY);
      currentY += 10;
      
      const clientsData = clients.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        client.niu || 'Non renseigné',
        client.regimefiscal || 'Non renseigné'
      ]);
      
      (doc as any).autoTable({
        startY: currentY,
        head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Régime Fiscal']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Nouvelle page si nécessaire
      if (currentY > 250 && index < Object.keys(clientsParCentre).length - 1) {
        doc.addPage();
        currentY = 20;
      }
    });
    
    doc.save(`clients-par-centre-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export const generateClientsAssujettisIGSReport = async () => {
  try {
    console.log('Génération du rapport des clients assujettis à l\'IGS...');
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les clients assujettis à l'IGS (personnes morales avec régime réel)
    const clientsIGS = data.clients.filter(client => 
      client.type === 'morale' && client.regimefiscal === 'reel'
    );
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Assujettis à l\'IGS', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${clientsIGS.length} clients`, 14, 36);
    doc.text('Critère: Personnes morales au régime réel', 14, 42);
    
    const clientsData = clientsIGS.map((client: any) => [
      client.raisonsociale || 'Non renseigné',
      client.formejuridique || 'Non renseigné',
      client.niu || 'Non renseigné',
      client.centrerattachement || 'Non renseigné',
      client.secteuractivite || 'Non renseigné'
    ]);
    
    (doc as any).autoTable({
      startY: 50,
      head: [['Raison Sociale', 'Forme Juridique', 'NIU', 'Centre', 'Secteur']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`clients-assujettis-igs-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

export const generateClientsAssujettsPatenteReport = async () => {
  try {
    console.log('Génération du rapport des clients assujettis à la Patente...');
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les clients assujettis à la patente (activité commerciale ou industrielle)
    const clientsPatente = data.clients.filter(client => {
      const secteur = client.secteuractivite?.toLowerCase() || '';
      return secteur.includes('commerce') || 
             secteur.includes('industrie') || 
             secteur.includes('artisanat') ||
             secteur.includes('restauration') ||
             secteur.includes('hotellerie');
    });
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Assujettis à la Patente', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${clientsPatente.length} clients`, 14, 36);
    doc.text('Critère: Activités commerciales, industrielles, artisanales', 14, 42);
    
    const clientsData = clientsPatente.map((client: any) => [
      client.nom || client.raisonsociale || 'Sans nom',
      client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
      client.niu || 'Non renseigné',
      client.centrerattachement || 'Non renseigné',
      client.secteuractivite || 'Non renseigné'
    ]);
    
    (doc as any).autoTable({
      startY: 50,
      head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Centre', 'Secteur d\'Activité']],
      body: clientsData,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`clients-assujettis-patente-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};
