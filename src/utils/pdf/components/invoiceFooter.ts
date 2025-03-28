
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
    
    // Fix TypeScript errors by using the proper method to access the internal methods
    const docWithTransform = doc as any;
    docWithTransform.translate(pageHeight/2, 100);
    docWithTransform.rotate(-45);
    
    doc.setTextColor(235, 235, 235);
    doc.text('PRISMA GESTION', 0, 0, { align: 'center' });
    doc.restoreGraphicsState();
  }
};
