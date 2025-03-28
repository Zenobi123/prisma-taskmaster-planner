
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Add footer and watermark to all pages
export const addInvoiceFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    
    // Bottom footer
    doc.setFont('helvetica', 'normal');
    doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 15);
    
    // Right side footer with page numbers
    doc.text(`Facture - Page ${i}/${pageCount}`, 170, pageHeight - 15);
    
    // Add date generated
    const today = new Date();
    const generateDate = format(today, 'dd/MM/yyyy à HH:mm', { locale: fr });
    doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 10);
    
    // Add watermark diagonal text in very light color
    doc.saveGraphicsState();
    
    // Use different approach for watermark since rotate/translate methods 
    // may not be available in the current jsPDF version
    doc.setTextColor(235, 235, 235);
    
    // Calculate center of page
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(30);
    
    // Instead of rotating, just place the watermark text
    doc.text('PRISMA GESTION', pageWidth/2, pageHeight/2, { 
      align: 'center',
      angle: 45
    });
    
    doc.restoreGraphicsState();
  }
};
