
import { PDFFacture } from './types';
import { DocumentService } from './services/DocumentService';
import { generatePrestationsTable } from './components/invoiceTableGenerator';
import { addPaymentsSection } from './components/invoicePayments';
import { addNotesSection } from './components/invoiceNotes';

export const generateInvoicePDF = (facture: PDFFacture, download: boolean = false) => {
  try {
    // Create a new document service
    const docService = new DocumentService('facture', 'Facture', facture.id);
    const doc = docService.getDocument();
    
    // Add standard header
    docService.addStandardHeader(facture.date);
    
    // Add info section for client
    docService.addInfoSection('CLIENT', [
      facture.client.nom,
      facture.client.adresse,
      `Tel: ${facture.client.telephone}`,
      `Email: ${facture.client.email}`
    ], 50);
    
    // Add payment details section
    docService.addAmountSection('TOTAL À PAYER', facture.montant, 90);
    
    // Add horizontal separator
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 130, 195, 130);
    
    // Add prestations table
    const tableFinishY = generatePrestationsTable(doc, facture);
    
    // Add total section
    const totalSectionY = docService.addAmountSection('TOTAL', facture.montant, tableFinishY);
    
    // Add payments section if available
    const paymentsSectionY = addPaymentsSection(doc, facture, totalSectionY);
    
    // Add notes if available
    if (facture.notes) {
      addNotesSection(doc, facture.notes, paymentsSectionY);
    }
    
    // Add standard footer
    docService.addStandardFooter();
    
    // Generate PDF
    return docService.generate(download);
    
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};
