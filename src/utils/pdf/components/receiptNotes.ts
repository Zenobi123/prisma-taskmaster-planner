
import jsPDF from 'jspdf';
import { PDF_THEME } from '../pdfTheme';

// Add notes section to the receipt PDF if notes are available
export const addReceiptNotes = (doc: jsPDF, paiement: any, startY: number): number => {
  if (!paiement.notes) {
    addLegalText(doc, startY + 5);
    return startY + 5;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textBody);
  doc.text('Notes:', 15, startY + 5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const notes = paiement.notes;
  const maxWidth = 180;
  const splitNotes = doc.splitTextToSize(notes, maxWidth);
  doc.text(splitNotes, 15, startY + 15);

  const notesHeight = Math.min(splitNotes.length * 5, 25);

  addLegalText(doc, startY + 25 + notesHeight);

  return startY + 25 + notesHeight;
};

const addLegalText = (doc: jsPDF, yPosition: number) => {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...PDF_THEME.textSecondary);
  doc.text('Ce reçu confirme le traitement de votre paiement.', 15, yPosition);
  doc.text('Document valable comme preuve de paiement.', 15, yPosition + 5);

  return yPosition + 10;
};
