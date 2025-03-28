
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Function to add the payments section to the invoice
export const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number): number => {
  if (!facture.paiements || facture.paiements.length === 0) {
    return startY; // No change in vertical position
  }
  
  // Add section header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  // Calculate remaining space on page
  const currentY = startY + 10;
  const pageHeight = doc.internal.pageSize.height;
  const remainingSpace = pageHeight - currentY - 40; // 40px for footer
  
  // If not enough space for payments section, create a new page
  if (remainingSpace < 60) {
    doc.addPage();
    return addPaymentsSection(doc, facture, 20); // Start at top of new page
  }
  
  doc.text("Historique des paiements", 15, currentY);
  
  // Add payments table header
  const tableTop = currentY + 10;
  const leftMargin = 15;
  const colWidths = [50, 45, 45, 45]; // Date, Mode, Référence, Montant
  
  // Create table header
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin, tableTop, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Date", leftMargin + 5, tableTop + 7);
  doc.text("Mode", leftMargin + colWidths[0] + 5, tableTop + 7);
  doc.text("Référence", leftMargin + colWidths[0] + colWidths[1] + 5, tableTop + 7);
  doc.text("Montant", leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 7);
  
  // Draw table rows for each payment
  doc.setFont('helvetica', 'normal');
  let rowY = tableTop + 10;
  
  facture.paiements.forEach((paiement, i) => {
    // Check if we need a new page for this row
    if (rowY + 10 > pageHeight - 40) {
      doc.addPage();
      rowY = 20; // Start at top of new page
      
      // Redraw the header on the new page
      doc.setFillColor(245, 245, 245);
      doc.rect(leftMargin, rowY, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text("Date", leftMargin + 5, rowY + 7);
      doc.text("Mode", leftMargin + colWidths[0] + 5, rowY + 7);
      doc.text("Référence", leftMargin + colWidths[0] + colWidths[1] + 5, rowY + 7);
      doc.text("Montant", leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + 5, rowY + 7);
      
      doc.setFont('helvetica', 'normal');
      rowY += 10;
    }
    
    // Add alternating row background
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(leftMargin, rowY, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
    }
    
    // Format the date
    let formattedDate = paiement.date;
    try {
      formattedDate = format(parseISO(paiement.date), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      console.error("Error formatting date", e);
    }
    
    // Format the amount
    const formattedAmount = new Intl.NumberFormat('fr-FR').format(paiement.montant);
    
    // Write payment information
    doc.text(formattedDate, leftMargin + 5, rowY + 7);
    doc.text(paiement.mode, leftMargin + colWidths[0] + 5, rowY + 7);
    doc.text(paiement.reference || "-", leftMargin + colWidths[0] + colWidths[1] + 5, rowY + 7);
    
    // Fix type error by converting the array to string
    const amountText = `${formattedAmount} XAF`;
    doc.text(amountText, leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + 5, rowY + 7);
    
    rowY += 10;
  });
  
  // Draw table border
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  const tableHeight = Math.min(10 + facture.paiements.length * 10, rowY - tableTop);
  doc.rect(leftMargin, tableTop, colWidths.reduce((a, b) => a + b, 0), tableHeight);
  
  // Add lines between columns
  for (let i = 1; i < colWidths.length; i++) {
    const x = leftMargin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.line(x, tableTop, x, tableTop + tableHeight);
  }
  
  // Add horizontal line after header
  doc.line(leftMargin, tableTop + 10, leftMargin + colWidths.reduce((a, b) => a + b, 0), tableTop + 10);
  
  return rowY + 10; // Return the Y position for the next section
};
