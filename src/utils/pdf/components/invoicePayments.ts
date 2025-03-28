
import jsPDF from 'jspdf';
import { formatDateForDisplay } from '../pdfComponents';
import { PDFFacture, Paiement } from '../types';

// Add payments section if available
export const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number): number => {
  // If no payments or empty payments array, return the same Y position
  if (!facture.paiements || facture.paiements.length === 0) {
    return startY;
  }
  
  // Add a little space after the previous section
  const sectionStartY = startY + 10;
  
  // Section title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text("Paiements reçus:", 15, sectionStartY);
  
  // Draw a light background for the payments section
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, sectionStartY + 5, 180, 10 + (facture.paiements.length * 8), 3, 3, 'F');
  
  // Table headers
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  
  const headers = ['Date', 'Mode', 'Référence', 'Montant (XAF)'];
  const colWidths = [40, 45, 45, 50];
  let xPos = 20;
  
  // Add headers
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], xPos, sectionStartY + 12);
    xPos += colWidths[i];
  }
  
  // Add payments data
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  
  let yPos = sectionStartY + 20;
  
  facture.paiements.forEach((paiement: Paiement) => {
    xPos = 20;
    
    // Format date
    const formattedDate = formatDateForDisplay(paiement.date);
    doc.text(formattedDate, xPos, yPos);
    xPos += colWidths[0];
    
    // Payment method 
    doc.text(paiement.mode, xPos, yPos);
    xPos += colWidths[1];
    
    // Reference (if available)
    doc.text(paiement.reference || '-', xPos, yPos);
    xPos += colWidths[2];
    
    // Format amount
    const formattedAmount = paiement.montant.toLocaleString('fr-FR');
    // Fix TypeScript error by converting formattedAmount to string
    doc.text(formattedAmount, xPos, yPos);
    
    yPos += 8;
  });
  
  // Add total row with light background
  doc.setFillColor(240, 248, 245);
  doc.rect(15, yPos, 180, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAYÉ:', 20, yPos + 7);
  
  // Calculate total paid
  const totalPaid = facture.paiements.reduce((sum, p) => sum + p.montant, 0);
  const formattedTotalPaid = totalPaid.toLocaleString('fr-FR');
  // Fix the TypeScript error by converting to string
  doc.text(formattedTotalPaid, 155, yPos + 7);
  
  // Return the final Y position
  return yPos + 15;
};
