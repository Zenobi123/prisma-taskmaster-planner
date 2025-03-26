
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

interface Prestation {
  description: string;
  quantite?: number;
  montant: number;
  taux?: number;
}

interface Paiement {
  date: string;
  montant: number;
  mode: string;
}

interface Client {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  // Add additional client information
  id?: string;
  niu?: string;
}

export interface Facture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: string;
  prestations: Prestation[];
  paiements?: Paiement[];
  notes?: string;
}

// Function to generate the PDF document
export const generatePDF = (facture: Facture, download?: boolean) => {
  try {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Facture ${facture.id}`,
      subject: 'Facture',
      author: 'PRISMA GESTION',
      keywords: 'facture, pdf, generate'
    });

    // Add company logo/header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(`PRISMA GESTION`, 10, 15);
    
    // Add invoice title
    doc.setFontSize(16);
    doc.text(`FACTURE N° ${facture.id}`, 140, 15);
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 20, 200, 20);

    // Add client information section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`CLIENT:`, 10, 30);
    doc.setFontSize(11);
    doc.text(`${facture.client.nom}`, 10, 35);
    
    // Add NIU if available
    if (facture.client.niu) {
      doc.text(`NIU: ${facture.client.niu}`, 10, 40);
    }
    
    doc.text(`${facture.client.adresse || ""}`, 10, 45);
    
    if (facture.client.telephone) {
      doc.text(`Tél: ${facture.client.telephone}`, 10, 50);
    }
    
    if (facture.client.email) {
      doc.text(`Email: ${facture.client.email}`, 10, 55);
    }

    // Add invoice details
    doc.setFontSize(11);
    doc.text(`Date: ${facture.date}`, 140, 35);
    doc.text(`Échéance: ${facture.echeance}`, 140, 40);
    doc.text(`Montant total: ${facture.montant.toLocaleString()} XAF`, 140, 45);
    
    // Display payment status
    let statusText = "";
    let statusColor = [0, 0, 0]; // Default: black
    
    if (facture.status === 'payée' || facture.status === 'payee') {
      statusText = "PAYÉE";
      statusColor = [0, 128, 0]; // Green
    } else if (facture.status === 'partiellement_payée' || facture.status === 'partiellement_payee') {
      statusText = "PARTIELLEMENT PAYÉE";
      statusColor = [255, 140, 0]; // Orange
    } else if (facture.status === 'en_retard') {
      statusText = "EN RETARD";
      statusColor = [220, 20, 60]; // Crimson
    } else {
      statusText = "EN ATTENTE";
      statusColor = [70, 130, 180]; // Steel Blue
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(12);
    doc.text(`${statusText}`, 140, 55);
    doc.setTextColor(0, 0, 0); // Reset text color

    // Prepare table data
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
        prestation.montant.toLocaleString(),
        taux.toString(),
        Math.round(montantTTC).toLocaleString()
      ];
      tableRows.push(row);
    });

    // Add table using autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'grid',
      headStyles: {
        fillColor: [84, 130, 53], // Custom green color
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });

    // Get the final Y position after table is drawn
    const finalY = (doc as any).lastAutoTable.finalY || 150;

    // Add payment information if available
    if (facture.paiements && facture.paiements.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text("Paiements:", 10, finalY + 15);

      let paymentY = finalY + 25;
      facture.paiements.forEach(paiement => {
        doc.setFontSize(10);
        doc.text(`${paiement.date}: ${paiement.montant.toLocaleString()} XAF (${paiement.mode})`, 10, paymentY);
        paymentY += 6;
      });
      
      // Display remaining amount due
      const remainingAmount = facture.montant - (facture.montant_paye || 0);
      doc.setFontSize(12);
      doc.text(`Montant restant dû: ${remainingAmount.toLocaleString()} XAF`, 140, finalY + 15);
    } else {
      // If no payments, display the total amount due
      doc.setFontSize(12);
      doc.text(`Montant à payer: ${facture.montant.toLocaleString()} XAF`, 140, finalY + 15);
    }

    // Add notes if available
    if (facture.notes) {
      doc.setFontSize(11);
      doc.text(`Notes: ${facture.notes}`, 10, finalY + 40);
    }

    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.text('PRISMA GESTION - Gestion comptable et fiscale', 10, pageHeight - 10);
      doc.text(`Facture ${facture.id} - Page ${i} sur ${pageCount}`, 140, pageHeight - 10);
    }

    if (download) {
      // Download the PDF
      doc.save(`Facture_${facture.id}.pdf`);
      return doc.output('blob');
    } else {
      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};

// Function to generate a payment receipt PDF
export const generateReceiptPDF = (paiement: any, download?: boolean) => {
  try {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Reçu de paiement ${paiement.reference || paiement.id}`,
      subject: 'Reçu de paiement',
      author: 'PRISMA GESTION',
      keywords: 'reçu, paiement, pdf'
    });

    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(`PRISMA GESTION`, 10, 15);
    
    // Add receipt title
    doc.setFontSize(16);
    doc.text(`REÇU DE PAIEMENT`, 140, 15);
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 20, 200, 20);

    // Add client information section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`CLIENT:`, 10, 30);
    doc.setFontSize(11);
    doc.text(`${paiement.client || "Client"}`, 10, 35);
    
    // Add reference and date
    doc.setFontSize(11);
    doc.text(`Référence: ${paiement.reference || paiement.id}`, 140, 35);
    doc.text(`Date: ${paiement.date}`, 140, 40);
    doc.text(`Mode: ${paiement.mode}`, 140, 45);
    
    if (paiement.facture) {
      doc.text(`Facture associée: ${paiement.facture}`, 140, 50);
    }
    
    if (paiement.reference_transaction) {
      doc.text(`Réf. transaction: ${paiement.reference_transaction}`, 140, 55);
    }

    // Highlight payment amount
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(10, 50, 100, 25, 3, 3, 'F');
    doc.setFontSize(12);
    doc.text(`MONTANT PAYÉ:`, 15, 60);
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text(`${paiement.montant.toLocaleString()} XAF`, 15, 70);
    
    // Add credit note if relevant
    if (paiement.est_credit) {
      doc.setTextColor(0, 128, 0);
      doc.setFontSize(11);
      doc.text(`Ce paiement est un crédit (avance) sur compte client`, 10, 85);
      doc.setTextColor(0, 0, 0);
    }
    
    // Add notes if available
    if (paiement.notes) {
      doc.setFontSize(11);
      doc.text(`Notes:`, 10, 100);
      doc.setFontSize(10);
      
      // Split long notes into multiple lines
      const notes = paiement.notes;
      const maxWidth = 180;
      const splitNotes = doc.splitTextToSize(notes, maxWidth);
      doc.text(splitNotes, 10, 105);
    }

    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.text('PRISMA GESTION - Gestion comptable et fiscale', 10, pageHeight - 10);
      doc.text(`Reçu ${paiement.reference || paiement.id} - Page ${i} sur ${pageCount}`, 140, pageHeight - 10);
    }

    if (download) {
      // Download the PDF
      doc.save(`Recu_${paiement.reference || paiement.id}.pdf`);
      return doc.output('blob');
    } else {
      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la génération du reçu PDF:", error);
    throw error;
  }
};
