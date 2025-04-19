
import jsPDF from 'jspdf';

export const addDocumentWatermark = (doc: jsPDF, text: string): void => {
  doc.saveGraphicsState();
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  const centerX = pageWidth/2;
  const centerY = pageHeight/2;
  
  // Set up text appearance
  doc.setTextColor(235, 235, 235);
  doc.setFontSize(30);
  
  // Calculate rotation angle (-45 degrees)
  const angle = -45 * Math.PI / 180;
  
  // Save current transform matrix
  doc.saveGraphicsState();
  
  // Move to center, rotate, then move back
  doc.setCurrentTransformationMatrix(
    Math.cos(angle), // a
    Math.sin(angle), // b
    -Math.sin(angle), // c 
    Math.cos(angle), // d
    centerX, // e (translation X)
    centerY  // f (translation Y)
  );
  
  // Draw text centered at origin
  doc.text(text, 0, 0, { align: 'center', baseline: 'middle' });
  
  // Restore previous graphics state
  doc.restoreGraphicsState();
};
