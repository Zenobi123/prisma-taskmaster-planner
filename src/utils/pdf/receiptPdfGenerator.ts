
import jsPDF from 'jspdf';
import { SimplifiedClient, PdfPaiement } from './types';
import { addCompanyLogo, addInvoiceInfoBox } from './pdfComponents';
import { addReceiptHeader } from './components/receiptHeader';
import { addReceiptAmountSection } from './components/receiptAmountSection';
import { addReceiptFooter } from './components/receiptFooter';

/**
 * Format a client object for receipt PDF generation
 */
export const formatClientForReceipt = (client: any): SimplifiedClient => {
  let clientName = "";
  
  // Handle different client structures
  if (typeof client === 'string') {
    clientName = client;
  } else if (client && typeof client === 'object') {
    if ('nom' in client) {
      clientName = client.nom;
    } else if ('raisonsociale' in client) {
      clientName = client.raisonsociale;
    }
  }
  
  // Extract address if available
  let adresse = "";
  if (client && typeof client === 'object' && 'adresse' in client) {
    if (typeof client.adresse === 'string') {
      adresse = client.adresse;
    } else if (client.adresse && typeof client.adresse === 'object') {
      // Try to compose the address
      const addrObj = client.adresse as Record<string, any>;
      const ville = addrObj.ville || "";
      const quartier = addrObj.quartier || "";
      adresse = [ville, quartier].filter(Boolean).join(", ");
    }
  }
  
  // Extract contact info if available
  let telephone = "";
  let email = "";
  
  if (client && typeof client === 'object' && 'contact' in client) {
    if (typeof client.contact === 'object' && client.contact) {
      const contactObj = client.contact as Record<string, any>;
      telephone = contactObj.telephone || "";
      email = contactObj.email || "";
    }
  }
  
  return {
    nom: clientName,
    adresse,
    telephone,
    email,
    niu: client && typeof client === 'object' && 'niu' in client ? client.niu : ""
  };
};

/**
 * Generate PDF receipt for a payment
 * @param paiement Payment data
 * @param download Whether to download or open in a new tab
 * @returns PDF blob or nothing
 */
export const generateReceiptPDF = (paiement: PdfPaiement, download: boolean = false) => {
  try {
    // Create PDF document with improved quality
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2,
      hotfixes: ['px_scaling']
    });
    
    // Set document properties
    doc.setProperties({
      title: `Reçu de paiement ${paiement.reference || paiement.id}`,
      subject: 'Reçu de paiement',
      author: 'PRISMA GESTION',
      keywords: 'reçu, paiement, pdf, generate',
      creator: 'PRISMA GESTION'
    });
    
    // Add header with enhanced design
    addReceiptHeader(doc, paiement);
    
    // Calculate start position based on header
    let currentY = 100;
    
    // Add amount section with enhanced styling
    currentY = addReceiptAmountSection(doc, paiement, currentY);
    
    // Add notes if available
    if (paiement.notes) {
      doc.setFillColor(240, 250, 240);
      doc.roundedRect(15, currentY + 10, 180, 30, 3, 3, 'F');
      
      doc.setDrawColor(200, 220, 200);
      doc.setLineWidth(0.2);
      doc.roundedRect(15, currentY + 10, 180, 30, 3, 3, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 98, 85);
      doc.text("Notes:", 25, currentY + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      
      // Handle multiline notes
      const splitNotes = doc.splitTextToSize(paiement.notes, 150);
      doc.text(splitNotes, 25, currentY + 28);
    }
    
    // Add receipt footer with reference
    addReceiptFooter(doc, paiement.reference || String(paiement.id || ""));
    
    // Generate output based on download parameter
    if (download) {
      doc.save(`Recu_paiement_${paiement.reference || paiement.id || "sans_reference"}.pdf`);
      return doc.output('blob');
    } else {
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      return pdfBlob;
    }
  } catch (error) {
    console.error("Erreur lors de la génération du reçu de paiement:", error);
    throw error;
  }
};
