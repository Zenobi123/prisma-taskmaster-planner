
import jsPDF from 'jspdf';
import { addCompanyLogo, addInvoiceInfoBox } from '../pdfComponents';

// Add header section to the receipt PDF with enhanced styling
export const addReceiptHeader = (doc: jsPDF, paiement: any) => {
  // Add company logo with improved visual quality
  addCompanyLogo(doc);
  
  // Add receipt info box with better design
  addInvoiceInfoBox(doc, 'REÇU DE PAIEMENT', paiement.reference || paiement.id, paiement.date);
  
  // Add horizontal separator line with enhanced styling
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.5);
  doc.line(15, 90, 195, 90);
  
  // Payment details section title with improved typography
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green for consistency
  doc.text('DÉTAILS DU PAIEMENT', 15, 100);
  
  // Add subtle underline for section title
  doc.setLineWidth(0.2);
  doc.line(15, 102, 75, 102);
};
