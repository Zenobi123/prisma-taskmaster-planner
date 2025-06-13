
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';
import { shouldClientBeSubjectToObligation } from '@/services/fiscal/defaultObligationRules';

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
    const data = await ReportDataService.getAllReportData();
    
    const personnesMorales = data.clients.filter((c: any) => c.type === 'morale');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Personnes Morales', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${personnesMorales.length} clients`, 14, 36);
    
    if (personnesMorales.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucune personne morale trouvée.', 14, 50);
    } else {
      const clientsData = personnesMorales.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.niu || 'Non renseigné',
        formatPropertyValue(client.formejuridique),
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite),
        formatPropertyValue(client.statut)
      ]);
      
      (doc as any).autoTable({
        startY: 45,
        head: [['Raison Sociale', 'NIU', 'Forme Juridique', 'Régime Fiscal', 'Secteur', 'Statut']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`personnes-morales-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport personnes morales:', error);
  }
};

export const generatePersonnesPhysiquesReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const personnesPhysiques = data.clients.filter((c: any) => c.type === 'physique');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Personnes Physiques', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${personnesPhysiques.length} clients`, 14, 36);
    
    if (personnesPhysiques.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucune personne physique trouvée.', 14, 50);
    } else {
      const clientsData = personnesPhysiques.map((client: any) => [
        client.nom || 'Sans nom',
        client.niu || 'Non renseigné',
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite),
        formatPropertyValue(client.statut)
      ]);
      
      (doc as any).autoTable({
        startY: 45,
        head: [['Nom', 'NIU', 'Régime Fiscal', 'Secteur', 'Statut']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`personnes-physiques-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport personnes physiques:', error);
  }
};

export const generateClientsParCentreReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Clients par Centre des Impôts', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Grouper par centre de rattachement
    const clientsParCentre = data.clients.reduce((acc: any, client: any) => {
      const centre = client.centrerattachement || 'Centre non défini';
      if (!acc[centre]) {
        acc[centre] = [];
      }
      acc[centre].push(client);
      return acc;
    }, {});
    
    let currentY = 40;
    
    Object.entries(clientsParCentre).forEach(([centre, clients]: [string, any]) => {
      // Titre du centre
      doc.setFontSize(12);
      doc.text(`${centre} (${clients.length} clients)`, 14, currentY);
      currentY += 10;
      
      const centreData = clients.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        client.niu || 'Non renseigné',
        formatPropertyValue(client.regimefiscal)
      ]);
      
      (doc as any).autoTable({
        startY: currentY,
        head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Régime Fiscal']],
        body: centreData,
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
    
    doc.save(`clients-par-centre-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients par centre:', error);
  }
};

export const generateClientsAssujettisIGSReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les clients assujettis à l'IGS selon les règles métier
    const clientsAssujettisIGS = data.clients.filter((client: any) => {
      return shouldClientBeSubjectToObligation(client, "igs");
    });
    
    console.log(`Clients assujettis IGS trouvés: ${clientsAssujettisIGS.length}`);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Clients Assujettis IGS', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${clientsAssujettisIGS.length} clients assujettis`, 14, 36);
    
    if (clientsAssujettisIGS.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client assujetti à l\'IGS trouvé.', 14, 50);
    } else {
      const clientsData = clientsAssujettisIGS.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        client.niu || 'Non renseigné',
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite)
      ]);
      
      (doc as any).autoTable({
        startY: 45,
        head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Régime Fiscal', 'Secteur']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`clients-assujettis-igs-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients assujettis IGS:', error);
  }
};

export const generateClientsAssujettsPatenteReport = async () => {
  try {
    const data = await ReportDataService.getAllReportData();
    
    // Filtrer les clients assujettis à la Patente selon les règles métier
    const clientsAssujettisPatente = data.clients.filter((client: any) => {
      return shouldClientBeSubjectToObligation(client, "patente");
    });
    
    console.log(`Clients assujettis Patente trouvés: ${clientsAssujettisPatente.length}`);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport Clients Assujettis Patente', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${clientsAssujettisPatente.length} clients assujettis`, 14, 36);
    
    if (clientsAssujettisPatente.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucun client assujetti à la Patente trouvé.', 14, 50);
    } else {
      const clientsData = clientsAssujettisPatente.map((client: any) => [
        client.nom || client.raisonsociale || 'Sans nom',
        client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
        client.niu || 'Non renseigné',
        formatPropertyValue(client.regimefiscal),
        formatPropertyValue(client.secteuractivite)
      ]);
      
      (doc as any).autoTable({
        startY: 45,
        head: [['Nom/Raison Sociale', 'Type', 'NIU', 'Régime Fiscal', 'Secteur']],
        body: clientsData,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }
    
    doc.save(`clients-assujettis-patente-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients assujettis Patente:', error);
  }
};
