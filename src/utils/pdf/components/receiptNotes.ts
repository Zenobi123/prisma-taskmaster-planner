
import jsPDF from 'jspdf';

// Add notes section to the receipt PDF with enhanced styling
export const addReceiptNotes = (doc: jsPDF, paiement: any, startY: number): number => {
  if (!paiement.notes) {
    // Add legal text and confirmation even if no notes
    addLegalText(doc, startY + 5);
    return startY + 20; 
  }
  
  // Create a notes section with better visual design
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(15, startY + 5, 180, 35, 3, 3, 'F');
  
  // Add border for better definition
  doc.setDrawColor(230, 240, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, startY + 5, 180, 35, 3, 3, 'S');
  
  // Add notes title with improved typography
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green for consistency
  doc.text('Notes:', 20, startY + 15);
  
  // Add notes content with better formatting
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Split long notes into multiple lines with better handling
  const notes = paiement.notes;
  const maxWidth = 170;
  const splitNotes = doc.splitTextToSize(notes, maxWidth);
  doc.text(splitNotes, 20, startY + 25);
  
  // Calculate the height taken by the notes to determine where to place the legal text
  const notesHeight = Math.min(splitNotes.length * 5, 25); // Cap at reasonable height
  
  addLegalText(doc, startY + 45);
  
  return startY + 65; // Return the next Y position with additional space
};

// Add legal text and confirmation to the receipt with enhanced styling
const addLegalText = (doc: jsPDF, yPosition: number) => {
  // Create a legal text box with subtle background
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, yPosition, 180, 20, 3, 3, 'F');
  
  // Add content with improved typography
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 80, 80);
  doc.text('Ce reçu confirme le traitement de votre paiement.', 20, yPosition + 8);
  doc.text('Document valable comme preuve de paiement.', 20, yPosition + 15);
  
  // Add subtle legal information icon or marker
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.1);
  doc.circle(17, yPosition + 8, 1.5);
  doc.circle(17, yPosition + 15, 1.5);
  
  return yPosition + 25; // Return the Y position after the legal text
};
