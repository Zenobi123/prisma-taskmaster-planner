
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';

// Add notes section if available
export const addNotesSection = (doc: jsPDF, facture: PDFFacture, startY: number) => {
  if (!facture.notes) return;
  
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, startY, 180, 20, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text("Notes:", 20, startY + 7);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Handle multiline notes
  const splitNotes = doc.splitTextToSize(facture.notes, 160);
  doc.text(splitNotes, 20, startY + 14);
};
