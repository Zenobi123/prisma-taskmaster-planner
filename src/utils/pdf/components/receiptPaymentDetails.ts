
import jsPDF from 'jspdf';
import { formatDateForDisplay } from '../pdfComponents';

// Add payment details section to the receipt PDF with enhanced styling
export const addReceiptPaymentDetails = (doc: jsPDF, paiement: any): number => {
  // Create a box for payment info with better visual design
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(15, 105, 180, 50, 3, 3, 'F');
  
  // Add border for better definition
  doc.setDrawColor(230, 240, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, 105, 180, 50, 3, 3, 'S');
  
  // Client information with improved typography
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 70, 70);
  doc.text('Client:', 25, 115);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Get client name with better handling for various formats
  let clientName = "Client";
  
  if (paiement.client) {
    if (typeof paiement.client === 'object') {
      // If it's an object, get the name or company name
      clientName = paiement.client.nom || paiement.client.raisonsociale || "Client";
    } else if (typeof paiement.client === 'string') {
      // If it's a string
      clientName = paiement.client;
    }
  }
  
  doc.text(clientName, 60, 115);
  
  // Reference information with better spacing
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 70, 70);
  doc.text('Référence:', 25, 125);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(paiement.reference || paiement.id, 60, 125);
  
  // Date information with better formatting
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 70, 70);
  doc.text('Date:', 25, 135);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Format date with better handling
  const formattedDate = formatDateForDisplay(paiement.date);
  doc.text(formattedDate, 60, 135);
  
  // Payment method with better styling
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 70, 70);
  doc.text('Mode:', 25, 145);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Format payment method with first letter capitalized
  const mode = paiement.mode.charAt(0).toUpperCase() + paiement.mode.slice(1).replace('_', ' ');
  doc.text(mode, 60, 145);
  
  // Right column information with better alignment
  
  // Invoice reference if available
  if (paiement.facture) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('Facture associée:', 115, 115);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(paiement.facture, 170, 115);
  }
  
  // Transaction reference if available
  if (paiement.reference_transaction) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('Réf. transaction:', 115, 125);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(paiement.reference_transaction, 170, 125);
  }
  
  // Credit note information with better visual emphasis
  if (paiement.est_credit) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text('Type:', 115, 135);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 128, 0); // Green for credit
    doc.text('Crédit (Avance)', 170, 135);
    doc.setTextColor(60, 60, 60); // Reset color
  }
  
  return 155; // Return the Y position for the next section
};
