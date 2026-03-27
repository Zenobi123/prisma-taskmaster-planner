
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { PDF_THEME } from '../pdfTheme';

// Add notes section if available
export const addNotesSection = (doc: jsPDF, notes: string, startY: number) => {
  if (!notes) return startY;

  doc.setFillColor(...PDF_THEME.bgLight);
  doc.roundedRect(15, startY, 180, 20, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textBody);
  doc.text("Notes:", 20, startY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const splitNotes = doc.splitTextToSize(notes, 160);
  doc.text(splitNotes, 20, startY + 14);

  return startY + 25;
};
