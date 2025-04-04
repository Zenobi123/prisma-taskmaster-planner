
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Add footer and watermark to all pages with improved quality
export const addInvoiceFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Add footer background for better visual separation
    doc.setFillColor(250, 250, 250);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    // Add subtle footer line
    doc.setDrawColor(200, 220, 200);
    doc.setLineWidth(0.2);
    doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
    
    // Bottom footer with improved typography
    doc.setFont('helvetica', 'normal');
    doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 18);
    
    // Right side footer with page numbers
    doc.text(`Facture - Page ${i}/${pageCount}`, 170, pageHeight - 18);
    
    // Add date generated with better formatting
    const today = new Date();
    const generateDate = format(today, 'dd/MM/yyyy à HH:mm', { locale: fr });
    doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 12);
    
    // Add watermark diagonal text in very light color with better positioning
    doc.saveGraphicsState();
    
    // Use better watermark approach for jsPDF v2 compatibility
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(30);
    
    // Calculate center of page for watermark
    const watermarkX = pageWidth / 2;
    const watermarkY = pageHeight / 2;
    
    // Apply rotation - use matrix transformation instead
    const angle = -45 * Math.PI / 180;
    doc.setTransform(
      Math.cos(angle), Math.sin(angle),
      -Math.sin(angle), Math.cos(angle),
      watermarkX, watermarkY
    );
    
    doc.text('PRISMA GESTION', 0, 0, { align: 'center' });
    
    doc.restoreGraphicsState();
  }
};
