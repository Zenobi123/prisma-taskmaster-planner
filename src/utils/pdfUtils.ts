
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  reference?: string;
}

interface Client {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  // Add additional client information
  id?: string;
  niu?: string;
  raisonsociale?: string;
  type?: string;
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

// Function to format date from any string format to "dd/MM/yyyy"
const formatDateForDisplay = (dateString: string): string => {
  try {
    // Parse the date string to create a Date object
    const date = new Date(dateString);
    // Format the date to "dd/MM/yyyy"
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return the original string if parsing fails
  }
};

// Add a company logo to the PDF
const addCompanyLogo = (doc: jsPDF) => {
  // You can add a base64 encoded logo here
  // For now we'll just add text for the company name with styling
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('PRISMA GESTION', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Gestion comptable et fiscale', 15, 25);
  doc.text('Yaoundé, Cameroun', 15, 30);
  doc.text('Tel: +237 123 456 789', 15, 35);
  doc.text('Email: contact@prismagestion.com', 15, 40);
};

// Add the invoice info box on the right side
const addInvoiceInfoBox = (doc: jsPDF, title: string, reference: string, date: string) => {
  // Draw info box with light green background
  doc.setFillColor(240, 248, 240); // Light green background
  doc.roundedRect(120, 15, 75, 30, 3, 3, 'F');
  
  // Add title and details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text(title, 130, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`N° ${reference}`, 130, 32);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDateForDisplay(date)}`, 130, 38);
};

// Add client information section
const addClientSection = (doc: jsPDF, client: Client) => {
  // Create a box for client info
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, 50, 180, 35, 3, 3, 'F');
  
  // Add client header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('CLIENT', 20, 60);
  
  // Add client details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Company or person name based on client type
  if (client.type === 'morale' && client.raisonsociale) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${client.raisonsociale}`, 20, 67);
    doc.setFont('helvetica', 'normal');
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text(`${client.nom}`, 20, 67);
    doc.setFont('helvetica', 'normal');
  }
  
  // NIU if available
  if (client.niu) {
    doc.text(`NIU: ${client.niu}`, 20, 74);
  }
  
  // Address and contact info
  if (client.adresse) {
    doc.text(`${client.adresse}`, 20, 80);
  }
  
  if (client.telephone || client.email) {
    let contactInfo = '';
    if (client.telephone) contactInfo += `Tél: ${client.telephone}`;
    if (client.telephone && client.email) contactInfo += ' | ';
    if (client.email) contactInfo += `Email: ${client.email}`;
    doc.text(contactInfo, 120, 74);
  }
};

// Function to generate the PDF document for invoices
export const generatePDF = (facture: Facture, download?: boolean) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Facture ${facture.id}`,
      subject: 'Facture',
      author: 'PRISMA GESTION',
      keywords: 'facture, pdf, generate'
    });
    
    // Add company logo/header
    addCompanyLogo(doc);
    
    // Add invoice info box
    addInvoiceInfoBox(doc, 'FACTURE', facture.id, facture.date);
    
    // Add client information section
    addClientSection(doc, facture.client);
    
    // Add invoice details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    // Add payment details box
    doc.setFillColor(240, 248, 240); // Light green background
    doc.roundedRect(120, 90, 75, 30, 3, 3, 'F');
    
    doc.text(`Échéance: ${formatDateForDisplay(facture.echeance)}`, 130, 100);
    doc.text(`Montant total: ${facture.montant.toLocaleString('fr-FR')} XAF`, 130, 107);
    
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
    doc.setFont('helvetica', 'bold');
    doc.text(`${statusText}`, 130, 115);
    doc.setTextColor(0, 0, 0); // Reset text color
    
    // Add horizontal separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 130, 195, 130);
    
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
        prestation.montant.toLocaleString('fr-FR'),
        taux.toString(),
        Math.round(montantTTC).toLocaleString('fr-FR')
      ];
      tableRows.push(row);
    });
    
    // Add table using autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 135,
      theme: 'grid',
      headStyles: {
        fillColor: [50, 98, 85], // Dark green color
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
      margin: { left: 15, right: 15 }
    });
    
    // Get the final Y position after table is drawn
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Add total section
    doc.setFillColor(240, 248, 240);
    doc.roundedRect(130, finalY + 10, 65, 20, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text("TOTAL:", 140, finalY + 20);
    
    doc.setFontSize(12);
    doc.text(`${facture.montant.toLocaleString('fr-FR')} XAF`, 165, finalY + 20);
    
    // Add payment information if available
    if (facture.paiements && facture.paiements.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text("Paiements:", 15, finalY + 40);
      
      // Create a mini-table for payments
      const paymentTableHeaders = ["Date", "Référence", "Mode", "Montant (XAF)"];
      const paymentTableRows: string[][] = [];
      
      facture.paiements.forEach(paiement => {
        paymentTableRows.push([
          formatDateForDisplay(paiement.date),
          paiement.reference || "-",
          paiement.mode,
          paiement.montant.toLocaleString('fr-FR')
        ]);
      });
      
      autoTable(doc, {
        head: [paymentTableHeaders],
        body: paymentTableRows,
        startY: finalY + 45,
        theme: 'grid',
        headStyles: {
          fillColor: [132, 169, 140], // Medium green
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          3: { halign: 'right' }
        },
        margin: { left: 15, right: 15 }
      });
      
      // Get position after payment table
      const paymentFinalY = (doc as any).lastAutoTable.finalY || (finalY + 60);
      
      // Display remaining amount due
      const remainingAmount = facture.montant - (facture.montant_paye || 0);
      
      doc.setFillColor(remainingAmount > 0 ? [255, 245, 240] : [240, 255, 240]);
      doc.roundedRect(130, paymentFinalY + 10, 65, 20, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(remainingAmount > 0 ? [200, 60, 40] : [40, 160, 60]);
      doc.text("Montant restant dû:", 140, paymentFinalY + 20);
      
      doc.setFontSize(11);
      doc.text(`${remainingAmount.toLocaleString('fr-FR')} XAF`, 165, paymentFinalY + 25);
    } else {
      // If no payments, display the total amount due
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text(`Montant à payer: ${facture.montant.toLocaleString('fr-FR')} XAF`, 15, finalY + 40);
    }
    
    // Add notes if available
    if (facture.notes) {
      const noteY = finalY + (facture.paiements && facture.paiements.length > 0 ? 90 : 50);
      
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(15, noteY, 180, 20, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text("Notes:", 20, noteY + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      // Handle multiline notes
      const splitNotes = doc.splitTextToSize(facture.notes, 160);
      doc.text(splitNotes, 20, noteY + 14);
    }
    
    // Add footer with watermark
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      
      // Bottom footer
      doc.setFont('helvetica', 'normal');
      doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 15);
      
      // Right side footer with page numbers
      doc.text(`Facture ${facture.id} - Page ${i}/${pageCount}`, 170, pageHeight - 15);
      
      // Add date generated
      const today = new Date();
      const generateDate = format(today, 'dd/MM/yyyy à HH:mm', { locale: fr });
      doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 10);
      
      // Add watermark diagonal text in very light color
      doc.saveGraphicsState();
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      doc.translate(pageHeight/2, 100);
      doc.rotate(-45);
      doc.text('PRISMA GESTION', 0, 0, { align: 'center' });
      doc.restoreGraphicsState();
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
    
    // Add company logo/header
    addCompanyLogo(doc);
    
    // Add receipt info box
    addInvoiceInfoBox(doc, 'REÇU DE PAIEMENT', paiement.reference || paiement.id, paiement.date);
    
    // Add horizontal separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 90, 195, 90);
    
    // Payment details section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('DÉTAILS DU PAIEMENT', 15, 100);
    
    // Create a box for payment info
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(15, 105, 180, 50, 3, 3, 'F');
    
    // Client information
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Client:', 25, 115);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.client || "Client", 60, 115);
    
    // Reference information
    doc.setFont('helvetica', 'bold');
    doc.text('Référence:', 25, 125);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.reference || paiement.id, 60, 125);
    
    // Date information
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 25, 135);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDateForDisplay(paiement.date), 60, 135);
    
    // Payment method
    doc.setFont('helvetica', 'bold');
    doc.text('Mode:', 25, 145);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.mode, 60, 145);
    
    // Invoice reference if available
    if (paiement.facture) {
      doc.setFont('helvetica', 'bold');
      doc.text('Facture associée:', 115, 115);
      doc.setFont('helvetica', 'normal');
      doc.text(paiement.facture, 170, 115);
    }
    
    // Transaction reference if available
    if (paiement.reference_transaction) {
      doc.setFont('helvetica', 'bold');
      doc.text('Réf. transaction:', 115, 125);
      doc.setFont('helvetica', 'normal');
      doc.text(paiement.reference_transaction, 170, 125);
    }
    
    // Credit note information
    if (paiement.est_credit) {
      doc.setFont('helvetica', 'bold');
      doc.text('Type:', 115, 135);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 128, 0);
      doc.text('Crédit (Avance)', 170, 135);
      doc.setTextColor(60, 60, 60);
    }
    
    // Amount section with green background
    doc.setFillColor(240, 248, 240);
    doc.roundedRect(15, 165, 180, 30, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('MONTANT PAYÉ:', 25, 180);
    
    doc.setFontSize(16);
    doc.setTextColor(50, 98, 85);
    doc.text(`${paiement.montant.toLocaleString('fr-FR')} XAF`, 110, 180);
    
    // Add notes if available
    if (paiement.notes) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Notes:', 15, 210);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Split long notes into multiple lines
      const notes = paiement.notes;
      const maxWidth = 180;
      const splitNotes = doc.splitTextToSize(notes, maxWidth);
      doc.text(splitNotes, 15, 220);
    }
    
    // Add legal text and confirmation
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Ce reçu confirme le traitement de votre paiement.', 15, 245);
    doc.text('Document valable comme preuve de paiement.', 15, 250);
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      
      // Bottom footer
      doc.setFont('helvetica', 'normal');
      doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 15);
      
      // Right side footer with page numbers
      doc.text(`Reçu ${paiement.reference || paiement.id} - Page ${i}/${pageCount}`, 170, pageHeight - 15);
      
      // Add date generated
      const today = new Date();
      const generateDate = format(today, 'dd/MM/yyyy à HH:mm', { locale: fr });
      doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 10);
      
      // Add watermark diagonal text in very light color
      doc.saveGraphicsState();
      doc.setTextColor(240, 240, 240);
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      doc.translate(pageHeight/2, 100);
      doc.rotate(-45);
      doc.text('PRISMA GESTION', 0, 0, { align: 'center' });
      doc.restoreGraphicsState();
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

// Function to format client information for the receipt
export const formatClientForReceipt = (client: any): Client => {
  // If the client is already in the correct format, return it
  if (typeof client === 'object' && client.nom) {
    return client;
  }
  
  // If the client is just a string (name/ID), create a minimal client object
  if (typeof client === 'string') {
    return {
      nom: client,
      adresse: '',
      telephone: '',
      email: ''
    };
  }
  
  // Default empty client
  return {
    nom: 'Client',
    adresse: '',
    telephone: '',
    email: ''
  };
};
