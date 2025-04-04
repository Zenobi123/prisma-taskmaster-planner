
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';

// Add notes section if available with improved styling
export const addNotesSection = (doc: jsPDF, facture: PDFFacture, startY: number) => {
  if (!facture.notes) return startY;
  
  // Create a visually distinct notes section with better background
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(15, startY, 180, 30, 3, 3, 'F');
  
  // Add border for better separation
  doc.setDrawColor(230, 240, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, startY, 180, 30, 3, 3, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85);
  doc.text("Notes:", 20, startY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  
  // Handle multiline notes with better line spacing
  const splitNotes = doc.splitTextToSize(facture.notes, 160);
  doc.text(splitNotes, 20, startY + 18);
  
  return startY + 35; // Return the new Y position
};
