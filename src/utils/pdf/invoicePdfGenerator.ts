
import { PDFFacture } from './types';
import { DocumentService } from './services/DocumentService';
import { generatePrestationsTable } from './components/invoiceTableGenerator';
import { addPaymentsSection } from './components/invoicePayments';
import { addNotesSection } from './components/invoiceNotes';

export const generateInvoicePDF = (facture: PDFFacture, download: boolean = false) => {
  try {
    console.log("Début de génération PDF pour facture:", facture.id);
    
    // Create a new document service
    const docService = new DocumentService();
    const doc = docService.getDocument();
    
    // Add standard header
    docService.addStandardHeader();
    
    // Add title
    docService.addTitle(`Facture ${facture.id}`);
    
    // Add subtitle with date
    docService.addSubtitle(`Date: ${facture.date}`);
    
    // Add info section for client
    const clientInfoLines = [
      facture.client.nom || facture.client.raisonsociale || '',
      facture.client.adresse ? (typeof facture.client.adresse === 'string' ? 
          facture.client.adresse : 
          `${facture.client.adresse.ville || ''}, ${facture.client.adresse.quartier || ''}`) : '',
      facture.client.contact ? (typeof facture.client.contact === 'string' ? 
          facture.client.contact : 
          `${facture.client.contact.telephone || ''} ${facture.client.contact.email || ''}`) : '',
      facture.client.niu ? `NIU: ${facture.client.niu}` : ''
    ].filter(line => line); // Filter out empty lines
    
    docService.addSection('CLIENT', clientInfoLines);
    
    // Add payment details section
    docService.addSection('TOTAL À PAYER', [`${facture.montant} FCFA`]);
    
    // Add horizontal separator
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 130, 195, 130);
    
    // Add prestations table
    const tableFinishY = generatePrestationsTable(doc, facture);
    
    // Add total section
    docService.addSection('TOTAL', [`${facture.montant} FCFA`]);
    
    // Add payments section if available
    if (facture.paiements && facture.paiements.length > 0) {
      addPaymentsSection(doc, facture, tableFinishY + 20);
    }
    
    // Add notes if available - pass the notes string directly, not the entire facture object
    if (facture.notes && typeof facture.notes === 'string') {
      addNotesSection(doc, facture.notes, tableFinishY + 40);
    }
    
    // Add standard footer
    docService.addStandardFooter();
    
    // Add watermark if needed
    docService.addWatermark({
      text: `FACTURE ${facture.id}`,
      angle: -45,
      fontSize: 60,
      opacity: 0.15,
      color: '#888888'
    });
    
    console.log("Génération PDF terminée avec succès pour facture:", facture.id);
    
    // Generate PDF
    if (download) {
      docService.save(`facture_${facture.id}.pdf`);
      return null;
    } else {
      const blob = doc.output('blob');
      window.open(URL.createObjectURL(blob));
      return blob;
    }
    
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};
