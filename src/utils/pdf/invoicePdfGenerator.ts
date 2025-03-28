
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFFacture } from './types';
import { addInvoiceHeader } from './components/invoiceHeader';
import { addPrestationsTable, addTotalSection } from './components/invoiceTable';
import { addPaymentsSection } from './components/invoicePayments';
import { addNotesSection } from './components/invoiceNotes';
import { addInvoiceFooter } from './components/invoiceFooter';

/**
 * Function to generate the PDF document for invoices
 * @param facture - Invoice data
 * @param download - If true, download the PDF; if false, open in a new tab
 * @returns Either a Blob (if download=true) or null (if download=false)
 */
export const generateInvoicePDF = (facture: PDFFacture, download: boolean = false) => {
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
    
    // Add footer with watermark - passing only the doc parameter
    addInvoiceFooter(doc);
    
    // Generate output based on download parameter
    if (download) {
      // Download the PDF
      doc.save(`Facture_${facture.id}.pdf`);
      return doc.output('blob');
    } else {
      // Create blob and open in new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      return pdfBlob;
    }
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};
