
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Paiement } from '@/types/paiement';
import { formatDateForDisplay, addCompanyLogo, addInvoiceInfoBox } from './pdfComponents';
import { Client } from '@/types/client';

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
      // Fix for TypeScript error - translate and rotate methods
      (doc as any).translate(pageHeight/2, 100);
      (doc as any).rotate(-45);
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
    return client as Client;
  }
  
  // If the client is just a string (name/ID), create a minimal client object
  if (typeof client === 'string') {
    return {
      id: '',
      nom: client,
      adresse: '',
      telephone: '',
      email: ''
    } as Client;
  }
  
  // Default empty client
  return {
    id: '',
    nom: 'Client',
    adresse: '',
    telephone: '',
    email: ''
  } as Client;
};
