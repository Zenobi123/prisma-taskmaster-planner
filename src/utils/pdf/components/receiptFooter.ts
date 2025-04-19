
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { addDocumentWatermark } from './watermark/documentWatermark';

// Add footer and watermark to all pages of the receipt
export const addReceiptFooter = (doc: jsPDF, reference: string) => {
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
    doc.text(`Reçu ${reference} - Page ${i}/${pageCount}`, 170, pageHeight - 15);
    
    // Add date generated
    const today = new Date();
    const generateDate = format(today, 'dd/MM/yyyy à HH:mm', { locale: fr });
    doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 10);
    
    // Add watermark
    addDocumentWatermark(doc, 'PRISMA GESTION');
  }
};
