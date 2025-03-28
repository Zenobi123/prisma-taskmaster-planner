
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture, Paiement } from '../types';

// Format date for display
const formatDateForDisplay = (dateString: string): string => {
  try {
    // Parse the date string to create a Date object
    const date = new Date(dateString);
    // Format the date to "dd/MM/yyyy"
    return date.toLocaleDateString('fr-FR');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return the original string if parsing fails
  }
};

// Add payment information if available
export const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number): number => {
  if (!facture.paiements || facture.paiements.length === 0) {
    // If no payments, display the total amount due
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text(`Montant à payer: ${facture.montant.toLocaleString('fr-FR')} XAF`, 15, startY + 10);
    
    return startY + 20; // Return the new Y position
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text("Paiements:", 15, startY + 10);
  
  // Create a mini-table for payments
  const paymentTableHeaders = ["Date", "Référence", "Mode", "Montant (XAF)"];
  const paymentTableRows: string[][] = [];
  
  facture.paiements.forEach(paiement => {
    paymentTableRows.push([
      formatDateForDisplay(paiement.date),
      paiement.reference || "-",
      paiement.mode,
      paiement.montant.toLocaleString('fr-FR')
    ]);
  });
  
  autoTable(doc, {
    head: [paymentTableHeaders],
    body: paymentTableRows,
    startY: startY + 15,
    theme: 'grid',
    headStyles: {
      fillColor: [132, 169, 140], // Medium green
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      3: { halign: 'right' }
    },
    margin: { left: 15, right: 15 }
  });
  
  // Get position after payment table
  const paymentFinalY = (doc as any).lastAutoTable.finalY || (startY + 30);
  
  // Display remaining amount due
  const remainingAmount = facture.montant - (facture.montant_paye || 0);
  
  doc.setFillColor(remainingAmount > 0 ? [255, 245, 240] : [240, 255, 240]);
  doc.roundedRect(130, paymentFinalY + 10, 65, 20, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(remainingAmount > 0 ? [200, 60, 40] : [40, 160, 60]);
  doc.text("Montant restant dû:", 140, paymentFinalY + 20);
  
  doc.setFontSize(11);
  doc.text(`${remainingAmount.toLocaleString('fr-FR')} XAF`, 165, paymentFinalY + 25);
  
  return paymentFinalY + 35; // Return the new Y position
};
