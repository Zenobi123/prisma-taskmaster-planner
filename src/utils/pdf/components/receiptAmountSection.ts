
import jsPDF from 'jspdf';
import { PDF_THEME } from '../pdfTheme';

// Add amount section to the receipt PDF
export const addReceiptAmountSection = (doc: jsPDF, paiement: any, startY: number): number => {
  doc.setFillColor(...PDF_THEME.bgPrimary);
  doc.roundedRect(15, startY + 10, 180, 30, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textHeading);
  doc.text('MONTANT PAYÉ:', 25, startY + 25);

  doc.setFontSize(16);
  doc.setTextColor(...PDF_THEME.primaryDark);

  // Format the amount with thousand separators and F CFA currency
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(paiement.montant);
  doc.text(`${formattedAmount} F CFA`, 110, startY + 25);

  return startY + 40;
};
