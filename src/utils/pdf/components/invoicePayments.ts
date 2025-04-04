
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { formatDateForDisplay } from '../pdfComponents';

// Add payments section if available with improved styling
export const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number): number => {
  // Skip if no payments
  if (!facture.paiements || facture.paiements.length === 0) {
    return startY;
  }
  
  // Title for payments section with improved styling
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85);
  doc.text("PAIEMENTS REÇUS", 15, startY + 10);
  
  // Create a table-like structure with better styling for payments
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(15, startY + 15, 180, 10 + (facture.paiements.length * 8), 3, 3, 'F');
  
  // Add column headers with improved styling
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text("Date", 20, startY + 22);
  doc.text("Référence", 60, startY + 22);
  doc.text("Mode", 100, startY + 22);
  doc.text("Montant", 165, startY + 22, { align: 'right' });
  
  // Add subtle header underline for better separation
  doc.setDrawColor(230, 240, 230);
  doc.setLineWidth(0.2);
  doc.line(20, startY + 24, 175, startY + 24);
  
  // List each payment with improved formatting
  let currentY = startY + 30;
  doc.setFont('helvetica', 'normal');
  
  facture.paiements.forEach((paiement, index) => {
    // Format date for better readability
    const dateStr = formatDateForDisplay(paiement.date);
    
    // Format mode with first letter capitalized
    const mode = paiement.mode.charAt(0).toUpperCase() + paiement.mode.slice(1);
    
    // Add payment details with improved spacing and alignment
    doc.text(dateStr, 20, currentY);
    doc.text(paiement.id || "-", 60, currentY);
    doc.text(mode, 100, currentY);
    
    // Format amount with thousand separator
    const montantStr = paiement.montant.toLocaleString('fr-FR') + " XAF";
    doc.text(montantStr, 175, currentY, { align: 'right' });
    
    // Add subtle row separator for better readability (except after last row)
    if (index < facture.paiements.length - 1) {
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.1);
      doc.line(20, currentY + 3, 175, currentY + 3);
    }
    
    currentY += 8;
  });
  
  // Add total paid amount
  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85);
  doc.text("Montant total payé:", 100, currentY);
  
  // Calculate total paid with better numeric handling
  const totalPaid = facture.paiements.reduce((sum, payment) => sum + payment.montant, 0);
  const totalPaidStr = totalPaid.toLocaleString('fr-FR') + " XAF";
  doc.text(totalPaidStr, 175, currentY, { align: 'right' });
  
  // Add remaining amount if not fully paid
  if (totalPaid < facture.montant) {
    currentY += 8;
    doc.text("Reste à payer:", 100, currentY);
    
    const remaining = facture.montant - totalPaid;
    const remainingStr = remaining.toLocaleString('fr-FR') + " XAF";
    
    // Use red color for remaining amount
    doc.setTextColor(200, 0, 0);
    doc.text(remainingStr, 175, currentY, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Reset text color
  }
  
  return currentY + 10; // Return next Y position with spacing
};
