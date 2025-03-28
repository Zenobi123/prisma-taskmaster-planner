
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFFacture } from './types';
import { addInvoiceHeader } from './components/invoiceHeader';
import { addPrestationsTable, addTotalSection } from './components/invoiceTable';
import { addPaymentsSection } from './components/invoicePayments';
import { addNotesSection } from './components/invoiceNotes';
import { addInvoiceFooter } from './components/invoiceFooter';

// Function to generate the PDF document for invoices
export const generateInvoicePDF = (facture: PDFFacture, download?: boolean) => {
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
    
    // Add header section (company logo, invoice info, client info)
    addInvoiceHeader(doc, facture);
    
    // Add services table and get the final Y position
    const tableFinishY = addPrestationsTable(doc, facture);
    
    // Add total section below the table
    const totalSectionY = addTotalSection(doc, facture, tableFinishY);
    
    // Add payment information if available
    const paymentsSectionY = addPaymentsSection(doc, facture, totalSectionY);
    
    // Add notes if available
    addNotesSection(doc, facture, paymentsSectionY);
    
    // Add footer with watermark
    addInvoiceFooter(doc, facture.id);
    
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
