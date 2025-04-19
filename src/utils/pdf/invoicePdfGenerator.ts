
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture } from './types';
import { DocumentService } from './documentService';

/**
 * Fonction pour générer un document PDF de facture de haute qualité
 * @param facture - Données de la facture
 * @param download - Si true, télécharger le PDF; si false, ouvrir dans un nouvel onglet
 * @returns Soit un Blob (si download=true) soit null (si download=false)
 */
export const generateInvoicePDF = (facture: PDFFacture, download: boolean = false) => {
  try {
    // Créer un nouveau service de document
    const docService = new DocumentService('facture', 'Facture', facture.id);
    const doc = docService.getDocument();
    
    // Ajouter l'en-tête standard
    docService.addStandardHeader(facture.date);
    
    // Ajouter les informations du client
    addClientSection(doc, facture);
    
    // Ajouter les détails de paiement
    addPaymentDetailsBox(doc, facture);
    
    // Ajouter un séparateur horizontal
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 130, 195, 130);
    
    // Ajouter le tableau des prestations
    const tableFinishY = addPrestationsTable(doc, facture);
    
    // Ajouter la section Total
    const totalSectionY = addTotalSection(doc, facture, tableFinishY);
    
    // Ajouter les informations de paiement si disponibles
    const paymentsSectionY = addPaymentsSection(doc, facture, totalSectionY);
    
    // Ajouter des notes si disponibles
    const notesY = docService.addNotesSection(facture.notes || '', paymentsSectionY);
    
    // Ajouter le pied de page avec filigrane
    docService.addStandardFooter();
    
    // Générer le PDF
    return docService.generate(download);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};

// Ajouter la section client
const addClientSection = (doc: jsPDF, facture: PDFFacture) => {
  // Créer une boîte pour les infos client
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, 50, 180, 35, 3, 3, 'F');
  
  // Ajouter l'en-tête client
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('CLIENT', 20, 60);
  
  // Ajouter les détails du client
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Afficher le nom du client
  doc.setFont('helvetica', 'bold');
  doc.text(`${facture.client.nom}`, 20, 67);
  doc.setFont('helvetica', 'normal');
  
  // Informations supplémentaires du client
  const additionalInfo: string[] = [];
  
  // Ajouter des champs spécifiques au client qui peuvent être disponibles
  if ('niu' in facture.client && facture.client.niu) {
    additionalInfo.push(`NIU: ${facture.client.niu}`);
  }
  
  if (additionalInfo.length > 0) {
    doc.text(additionalInfo.join(' | '), 20, 74);
  }
  
  // Ajouter l'adresse
  if ('adresse' in facture.client) {
    const clientAddress = typeof facture.client.adresse === 'object' 
      ? `${facture.client.adresse.ville || ''}, ${facture.client.adresse.quartier || ''}`
      : facture.client.adresse;
    doc.text(`${clientAddress}`, 20, 80);
  }
  
  // Infos de contact
  if ('contact' in facture.client && facture.client.contact) {
    let contactInfo = '';
    if (facture.client.contact.telephone) contactInfo += `Tél: ${facture.client.contact.telephone}`;
    if (facture.client.contact.telephone && facture.client.contact.email) contactInfo += ' | ';
    if (facture.client.contact.email) contactInfo += `Email: ${facture.client.contact.email}`;
    doc.text(contactInfo, 120, 74);
  }
};

// Ajouter la boîte de détails de paiement avec statut
const addPaymentDetailsBox = (doc: jsPDF, facture: PDFFacture) => {
  // Ajouter les détails de la facture
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Ajouter la boîte de détails de paiement
  doc.setFillColor(240, 248, 240); // Fond vert clair
  doc.roundedRect(120, 90, 75, 30, 3, 3, 'F');
  
  const formatDateForDisplay = (dateString: string): string => {
    try {
      // Créer un objet Date à partir de la chaîne
      const date = new Date(dateString);
      // Formater la date au format "dd/MM/yyyy"
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Renvoyer la chaîne d'origine en cas d'échec
    }
  };
  
  doc.text(`Échéance: ${formatDateForDisplay(facture.echeance)}`, 130, 100);
  doc.text(`Montant total: ${facture.montant.toLocaleString('fr-FR')} XAF`, 130, 107);
  
  // Afficher le statut de paiement
  let statusText = "";
  let statusColor: [number, number, number] = [0, 0, 0]; // Défaut: noir
  
  // Déterminer le statut en fonction de status_paiement si disponible
  const paymentStatus = facture.status_paiement || facture.status;
  
  if (paymentStatus === 'payée' || paymentStatus === 'payee') {
    statusText = "PAYÉE";
    statusColor = [0, 128, 0]; // Vert
  } else if (paymentStatus === 'partiellement_payée' || paymentStatus === 'partiellement_payee') {
    statusText = "PARTIELLEMENT PAYÉE";
    statusColor = [255, 140, 0]; // Orange
  } else if (paymentStatus === 'en_retard') {
    statusText = "EN RETARD";
    statusColor = [220, 20, 60]; // Rouge foncé
  } else {
    statusText = "EN ATTENTE";
    statusColor = [70, 130, 180]; // Bleu acier
  }
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${statusText}`, 130, 115);
  doc.setTextColor(0, 0, 0); // Réinitialiser la couleur du texte
};

// Ajouter le tableau des prestations
const addPrestationsTable = (doc: jsPDF, facture: PDFFacture): number => {
  // Préparer les données du tableau
  const tableColumn = ["Description", "Quantité", "Montant (XAF)", "Taux (%)", "Total (XAF)"];
  const tableRows: string[][] = [];
  
  facture.prestations.forEach(prestation => {
    const quantite = prestation.quantite || 1;
    const taux = prestation.taux || 0;
    const montantHT = prestation.montant * quantite;
    const montantTTC = montantHT * (1 + taux / 100);
    
    const row = [
      prestation.description,
      quantite.toString(),
      prestation.montant.toLocaleString('fr-FR'),
      taux.toString(),
      Math.round(montantTTC).toLocaleString('fr-FR')
    ];
    tableRows.push(row);
  });
  
  // Ajouter le tableau en utilisant autoTable
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 135,
    theme: 'grid',
    headStyles: {
      fillColor: [50, 98, 85], // Couleur vert foncé
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 249]
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Redessiner les en-têtes et le pied de page sur les nouvelles pages
    }
  });
  
  // Récupérer la position Y finale après le dessin du tableau
  return (doc as any).lastAutoTable.finalY || 150;
};

// Ajouter la section Total en dessous du tableau des prestations
const addTotalSection = (doc: jsPDF, facture: PDFFacture, finalY: number) => {
  doc.setFillColor(240, 248, 240);
  doc.roundedRect(130, finalY + 10, 65, 20, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text("TOTAL:", 140, finalY + 20);
  
  doc.setFontSize(12);
  doc.text(`${facture.montant.toLocaleString('fr-FR')} XAF`, 165, finalY + 20);
  
  return finalY + 30; // Renvoyer la nouvelle position Y
};

// Ajouter la section des paiements
const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number): number => {
  if (!facture.paiements || facture.paiements.length === 0) {
    return startY; // Pas de changement de position verticale
  }
  
  // Ajouter l'en-tête de section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  // Calculer l'espace restant sur la page
  const currentY = startY + 10;
  const pageHeight = doc.internal.pageSize.height;
  const remainingSpace = pageHeight - currentY - 40; // 40px pour le pied de page
  
  // Si pas assez d'espace pour la section des paiements, créer une nouvelle page
  if (remainingSpace < 60) {
    doc.addPage();
    return addPaymentsSection(doc, facture, 20); // Commencer en haut de la nouvelle page
  }
  
  doc.text("Historique des paiements", 15, currentY);
  
  // Utiliser autoTable pour la section des paiements également
  autoTable(doc, {
    head: [["Date", "Mode", "Référence", "Montant"]],
    body: facture.paiements.map(paiement => {
      // Formater la date
      let formattedDate = paiement.date;
      try {
        const date = new Date(paiement.date);
        formattedDate = date.toLocaleDateString('fr-FR');
      } catch (e) {
        console.error("Error formatting payment date", e);
      }
      
      return [
        formattedDate,
        paiement.mode,
        paiement.reference || "-",
        `${paiement.montant.toLocaleString('fr-FR')} XAF`
      ];
    }),
    startY: currentY + 5,
    theme: 'grid',
    headStyles: {
      fillColor: [132, 169, 140], // Vert plus clair que l'en-tête des prestations
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 50 },
      3: { cellWidth: 40, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 249]
    },
    margin: { left: 15, right: 15 }
  });
  
  // Récupérer la position Y finale après le tableau
  return (doc as any).lastAutoTable.finalY + 10;
};
