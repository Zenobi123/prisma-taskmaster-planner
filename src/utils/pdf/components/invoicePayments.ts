
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';

// Add payments information with better styling
export const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number) => {
  // Skip if no payments
  if (!facture.paiements || facture.paiements.length === 0) {
    return startY;
  }
  
  // Add section title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green
  doc.text('DÉTAILS DES PAIEMENTS', 15, startY + 10);
  
  // Add box around payments section
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, startY + 15, 180, 10 + (10 * facture.paiements.length), 3, 3, 'F');
  
  // Add border for better definition
  doc.setDrawColor(220, 230, 220);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, startY + 15, 180, 10 + (10 * facture.paiements.length), 3, 3, 'S');
  
  // Add header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Date', 20, startY + 22);
  doc.text('Montant', 80, startY + 22);
  doc.text('Mode de paiement', 130, startY + 22);
  doc.text('Référence', 170, startY + 22);
  
  // Add payments
  doc.setFont('helvetica', 'normal');
  facture.paiements.forEach((paiement, index) => {
    const y = startY + 32 + (index * 10);
    doc.text(paiement.date, 20, y);
    
    // Right-align the amount
    const amount = new Intl.NumberFormat('fr-FR').format(paiement.montant) + ' XAF';
    const amountWidth = doc.getTextWidth(amount);
    doc.text(amount, 110 - amountWidth, y);
    
    doc.text(paiement.mode, 130, y);
    // Use reference if available, otherwise use payment ID 
    const reference = paiement.reference || 
                      (typeof paiement === 'object' && 'id' in paiement ? 
                        String(paiement.id) : 
                        '');
    doc.text(reference, 170, y);
  });
  
  // Return new Y position
  return startY + 25 + (10 * facture.paiements.length);
};
