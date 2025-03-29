
import jsPDF from 'jspdf';

// Add payment details section to the receipt PDF
export const addReceiptPaymentDetails = (doc: jsPDF, paiement: any): number => {
  // Create a box for payment info
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, 105, 180, 50, 3, 3, 'F');
  
  // Client information
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Client:', 25, 115);
  doc.setFont('helvetica', 'normal');
  
  // Get client name - handle various possible formats
  const clientName = paiement.client 
    ? typeof paiement.client === 'object' 
      ? paiement.client.nom || paiement.client.raisonsociale || "Client"
      : paiement.client
    : "Client";
  doc.text(clientName, 60, 115);
  
  // Reference information
  doc.setFont('helvetica', 'bold');
  doc.text('Référence:', 25, 125);
  doc.setFont('helvetica', 'normal');
  doc.text(paiement.reference || paiement.id, 60, 125);
  
  // Date information
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 25, 135);
  doc.setFont('helvetica', 'normal');
  
  // Format date (handle string or Date object)
  const formattedDate = formatPaymentDate(paiement.date);
  doc.text(formattedDate, 60, 135);
  
  // Payment method
  doc.setFont('helvetica', 'bold');
  doc.text('Mode:', 25, 145);
  doc.setFont('helvetica', 'normal');
  doc.text(paiement.mode, 60, 145);
  
  // Invoice reference if available
  if (paiement.facture) {
    doc.setFont('helvetica', 'bold');
    doc.text('Facture associée:', 115, 115);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.facture, 170, 115);
  }
  
  // Transaction reference if available
  if (paiement.reference_transaction) {
    doc.setFont('helvetica', 'bold');
    doc.text('Réf. transaction:', 115, 125);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.reference_transaction, 170, 125);
  }
  
  // Credit note information
  if (paiement.est_credit) {
    doc.setFont('helvetica', 'bold');
    doc.text('Type:', 115, 135);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 128, 0);
    doc.text('Crédit (Avance)', 170, 135);
    doc.setTextColor(60, 60, 60);
  }
  
  return 155; // Return the Y position for the next section
};

// Format date from any format to a localized string
const formatPaymentDate = (dateString: string | Date): string => {
  try {
    const date = dateString instanceof Date 
      ? dateString 
      : new Date(dateString);
    
    // Create a formatter based on the browser's locale
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    // If parsing fails, return the original string
    return String(dateString);
  }
};
