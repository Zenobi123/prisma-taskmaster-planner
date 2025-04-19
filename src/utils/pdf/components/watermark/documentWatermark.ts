
import jsPDF from 'jspdf';

export const addDocumentWatermark = (doc: jsPDF, text: string) => {
  doc.saveGraphicsState();
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setTextColor(235, 235, 235);
  doc.setFontSize(30);
  
  // Position watermark in center of page
  doc.text(text, pageWidth/2, pageHeight/2, { 
    align: 'center',
    angle: 45
  });
  
  doc.restoreGraphicsState();
};
