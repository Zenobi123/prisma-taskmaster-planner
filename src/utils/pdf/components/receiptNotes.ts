
import jsPDF from 'jspdf';

// Add notes section to the receipt PDF if notes are available
export const addReceiptNotes = (doc: jsPDF, paiement: any, startY: number): number => {
  if (!paiement.notes) {
    // Add legal text and confirmation even if no notes
    addLegalText(doc, startY + 5);
    return startY + 5; 
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Notes:', 15, startY + 5);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Split long notes into multiple lines
  const notes = paiement.notes;
  const maxWidth = 180;
  const splitNotes = doc.splitTextToSize(notes, maxWidth);
  doc.text(splitNotes, 15, startY + 15);
  
  // Calculate the height taken by the notes to determine where to place the legal text
  const notesHeight = Math.min(splitNotes.length * 5, 25); // Cap at reasonable height
  
  addLegalText(doc, startY + 25 + notesHeight);
  
  return startY + 25 + notesHeight;
};

// Add legal text and confirmation to the receipt
const addLegalText = (doc: jsPDF, yPosition: number) => {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Ce reçu confirme le traitement de votre paiement.', 15, yPosition);
  doc.text('Document valable comme preuve de paiement.', 15, yPosition + 5);
  
  return yPosition + 10; // Return the Y position after the legal text
};
