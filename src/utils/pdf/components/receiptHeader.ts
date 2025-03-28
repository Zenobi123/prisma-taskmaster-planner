
import jsPDF from 'jspdf';
import { addCompanyLogo, addInvoiceInfoBox } from '../pdfComponents';

// Add header section to the receipt PDF
export const addReceiptHeader = (doc: jsPDF, paiement: any) => {
  // Add company logo/header
  addCompanyLogo(doc);
  
  // Add receipt info box
  addInvoiceInfoBox(doc, 'REÇU DE PAIEMENT', paiement.reference || paiement.id, paiement.date);
  
  // Add horizontal separator line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, 90, 195, 90);
  
  // Payment details section title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('DÉTAILS DU PAIEMENT', 15, 100);
};
