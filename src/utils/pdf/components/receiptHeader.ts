
import jsPDF from 'jspdf';
import { addCompanyLogo, addInvoiceInfoBox } from '../pdfComponents';
import { PDF_THEME } from '../pdfTheme';

// Add header section to the receipt PDF
export const addReceiptHeader = (doc: jsPDF, paiement: any) => {
  addCompanyLogo(doc);
  addInvoiceInfoBox(doc, 'REÇU DE PAIEMENT', paiement.reference || paiement.id, paiement.date);

  doc.setDrawColor(...PDF_THEME.border);
  doc.setLineWidth(0.5);
  doc.line(15, 90, 195, 90);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textHeading);
  doc.text('DÉTAILS DU PAIEMENT', 15, 100);
};
