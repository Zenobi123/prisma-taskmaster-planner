import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportDataService } from './reportDataService';

// Étendre le type jsPDF pour inclure autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

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

export const generatePersonnesMoralesReport = async () => {
  try {
    console.log('Génération du rapport des personnes morales...');
    const data = await ReportDataService.getAllReportData();
    
    if (!data || !data.clients) {
      throw new Error('Aucune donnée client disponible');
    }
    
    const personnesMorales = data.clients.filter(client => client.type === 'morale');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Personnes Morales', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Total: ${personnesMorales.length} clients`, 14, 36);
    
    if (personnesMorales.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client personne morale trouvé.', 14, 50);
    } else {
      const clientsData = personnesMorales.map((client: any) => [
        client.raisonsociale || 'Non renseigné',
        client.sigle || '',
        formatPropertyValue(client.formejuridique),
        client.niu || 'Non renseigné',
        client.centrerattachement || 'Non renseigné',
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite)
      ]);
      
      autoTable(doc, {
        startY: 45,
        head: [['Raison Sociale', 'Sigle', 'Forme Juridique', 'NIU', 'Centre', 'Régime Fiscal', 'Secteur']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`personnes-morales-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error(`Impossible de générer le rapport des personnes morales: ${error.message}`);
  }
};

export const generatePersonnesPhysiquesReport = async () => {
  try {
    console.log('Génération du rapport des personnes physiques...');
    const data = await ReportDataService.getAllReportData();
    
    if (!data || !data.clients) {
      throw new Error('Aucune donnée client disponible');
    }
    
    const personnesPhysiques = data.clients.filter(client => client.type === 'physique');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Personnes Physiques', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Total: ${personnesPhysiques.length} clients`, 14, 36);
    
    if (personnesPhysiques.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client personne physique trouvé.', 14, 50);
    } else {
      const clientsData = personnesPhysiques.map((client: any) => [
        client.nom || 'Non renseigné',
        formatPropertyValue(client.sexe),
        formatPropertyValue(client.etatcivil),
        client.niu || 'Non renseigné',
        client.centrerattachement || 'Non renseigné',
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite)
      ]);
      
      autoTable(doc, {
        startY: 45,
        head: [['Nom', 'Sexe', 'État Civil', 'NIU', 'Centre', 'Régime Fiscal', 'Secteur']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`personnes-physiques-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error(`Impossible de générer le rapport des personnes physiques: ${error.message}`);
  }
};

export const generateClientsParCentreReport = async () => {
  try {
    console.log('Génération du rapport par centre des impôts...');
    const data = await ReportDataService.getAllReportData();
    
    if (!data || !data.clients) {
      throw new Error('Aucune donnée client disponible');
    }
    
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
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    
    let currentY = 45;
    
    const centres = Object.keys(clientsParCentre);
    if (centres.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client trouvé.', 14, 50);
    } else {
      centres.forEach((centre, index) => {
        const clients = clientsParCentre[centre];
        
        // Titre du centre
        doc.setFontSize(12);
        doc.text(`${centre} (${clients.length} clients)`, 14, currentY);
        currentY += 10;
        
        const clientsData = clients.map((client: any) => [
          client.nom || client.raisonsociale || 'Sans nom',
          client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
          client.niu || 'Non renseigné',
          formatPropertyValue(client.regimefiscal)
        ]);
        
        autoTable(doc, {
          startY: currentY,
          head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Régime Fiscal']],
          body: clientsData,
          theme: 'grid',
          styles: { fontSize: 8 }
        });
        
        // @ts-ignore - autoTable ajoute lastAutoTable à doc
        currentY = (doc as any).lastAutoTable.finalY + 15;
        
        // Nouvelle page si nécessaire
        if (currentY > 250 && index < centres.length - 1) {
          doc.addPage();
          currentY = 20;
        }
      });
    }
    
    doc.save(`clients-par-centre-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error(`Impossible de générer le rapport par centre: ${error.message}`);
  }
};

export const generateClientsAssujettisIGSReport = async () => {
  try {
    console.log('Génération du rapport des clients assujettis à l\'IGS...');
    const data = await ReportDataService.getAllReportData();
    
    if (!data || !data.clients) {
      throw new Error('Aucune donnée client disponible');
    }
    
    // Filtrer les clients assujettis à l'IGS (personnes morales avec régime réel)
    const clientsIGS = data.clients.filter(client => 
      client.type === 'morale' && client.regimefiscal === 'reel'
    );
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Assujettis à l\'IGS', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Total: ${clientsIGS.length} clients`, 14, 36);
    doc.text('Critère: Personnes morales au régime réel', 14, 42);
    
    if (clientsIGS.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client assujetti à l\'IGS trouvé.', 14, 55);
    } else {
      const clientsData = clientsIGS.map((client: any) => [
        client.raisonsociale || 'Non renseigné',
        formatPropertyValue(client.formejuridique),
        client.niu || 'Non renseigné',
        client.centrerattachement || 'Non renseigné',
        formatPropertyValue(client.secteuractivite)
      ]);
      
      autoTable(doc, {
        startY: 50,
        head: [['Raison Sociale', 'Forme Juridique', 'NIU', 'Centre', 'Secteur']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`clients-assujettis-igs-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error(`Impossible de générer le rapport IGS: ${error.message}`);
  }
};

export const generateClientsAssujettsPatenteReport = async () => {
  try {
    console.log('Génération du rapport des clients assujettis à la Patente...');
    const data = await ReportDataService.getAllReportData();
    
    if (!data || !data.clients) {
      throw new Error('Aucune donnée client disponible');
    }
    
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
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Total: ${clientsPatente.length} clients`, 14, 36);
    doc.text('Critère: Activités commerciales, industrielles, artisanales', 14, 42);
    
    if (clientsPatente.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client assujetti à la Patente trouvé.', 14, 55);
    } else {
      const clientsData = clientsPatente.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        client.niu || 'Non renseigné',
        client.centrerattachement || 'Non renseigné',
        formatPropertyValue(client.secteuractivite)
      ]);
      
      autoTable(doc, {
        startY: 50,
        head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Centre', 'Secteur d\'Activité']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`clients-assujettis-patente-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error(`Impossible de générer le rapport Patente: ${error.message}`);
  }
};

export const generateClientsRegimeReelReport = async () => {
  try {
    console.log('Génération du rapport des clients au régime du réel...');
    const data = await ReportDataService.getAllReportData();
    
    if (!data || !data.clients) {
      throw new Error('Aucune donnée client disponible');
    }
    
    // Filtrer les clients au régime du réel
    const clientsRegimeReel = data.clients.filter(client => client.regimefiscal === 'reel');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport - Clients Assujettis au Régime du Réel', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Total: ${clientsRegimeReel.length} clients`, 14, 36);
    doc.text('Critère: Clients avec régime fiscal = RÉEL', 14, 42);
    
    if (clientsRegimeReel.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client au régime du réel trouvé.', 14, 55);
    } else {
      const clientsData = clientsRegimeReel.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        formatPropertyValue(client.formejuridique),
        client.niu || 'Non renseigné',
        client.centrerattachement || 'Non renseigné',
        formatPropertyValue(client.secteuractivite)
      ]);
      
      autoTable(doc, {
        startY: 50,
        head: [['Nom/Raison Sociale', 'Type', 'Forme Juridique', 'NIU', 'Centre', 'Secteur d\'Activité']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`clients-regime-reel-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error(`Impossible de générer le rapport des clients au régime du réel: ${error.message}`);
  }
};
