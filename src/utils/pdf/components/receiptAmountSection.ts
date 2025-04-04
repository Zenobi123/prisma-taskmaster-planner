
import jsPDF from 'jspdf';

// Add amount section to the receipt PDF with enhanced styling
export const addReceiptAmountSection = (doc: jsPDF, paiement: any, startY: number): number => {
  // Amount section with enhanced green background
  doc.setFillColor(240, 250, 240);
  doc.roundedRect(15, startY + 10, 180, 35, 3, 3, 'F');
  
  // Add border for better definition
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, startY + 10, 180, 35, 3, 3, 'S');
  
  // Add title with improved typography
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green for consistency
  doc.text('MONTANT PAYÉ:', 25, startY + 25);
  
  // Add amount with enhanced emphasis and formatting
  doc.setFontSize(16);
  doc.setTextColor(50, 98, 85);
  
  // Format the amount with thousand separators and XAF currency
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(paiement.montant);
  doc.text(`${formattedAmount} XAF`, 110, startY + 25);
  
  // Add additional payment info if available
  if (paiement.solde_restant !== undefined) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text('Solde restant:', 25, startY + 38);
    
    const soldeRestant = new Intl.NumberFormat('fr-FR').format(paiement.solde_restant);
    doc.setFont('helvetica', 'bold');
    
    // Use color based on remaining balance
    if (paiement.solde_restant > 0) {
      doc.setTextColor(200, 0, 0); // Red for remaining balance
    } else {
      doc.setTextColor(0, 128, 0); // Green for no remaining balance
    }
    
    doc.text(`${soldeRestant} XAF`, 110, startY + 38);
  }
  
  return startY + 50; // Return the Y position for the next section with more space
};
