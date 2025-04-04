
import jsPDF from 'jspdf';

// Add amount section to the receipt PDF
export const addReceiptAmountSection = (doc: jsPDF, paiement: any, startY: number): number => {
  // Amount section with green background
  doc.setFillColor(240, 248, 240);
  doc.roundedRect(15, startY + 10, 180, 30, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('MONTANT PAYÉ:', 25, startY + 25);
  
  doc.setFontSize(16);
  doc.setTextColor(50, 98, 85);
  
  // Format the amount with thousand separators and XAF currency
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(paiement.montant);
  doc.text(`${formattedAmount} XAF`, 110, startY + 25);
  
  return startY + 40; // Return the Y position for the next section
};
