
import jsPDF from 'jspdf';

export const addDocumentWatermark = (doc: jsPDF, text: string): void => {
  doc.saveGraphicsState();
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Utilisation correcte de la transformation avec les méthodes actuelles de jsPDF
  const centerX = pageWidth/2;
  const centerY = pageHeight/2;
  
  // Utiliser une matrice de transformation pour la rotation
  // Matrice de rotation de -45 degrés
  const angle = -45 * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  // Appliquer la transformation
  doc.setTextColor(235, 235, 235);
  doc.setFontSize(30);
  
  // Appliquer la transformation
  const matrix = new doc.Matrix(cos, sin, -sin, cos, centerX, centerY);
  doc.setTransform(matrix);
  
  // Texte centré avec une origine au centre de la page
  doc.text(text, 0, 0, { align: 'center', baseline: 'middle' });
  
  doc.restoreGraphicsState();
};
