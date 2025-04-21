
import { jsPDF } from "jspdf";

/**
 * Ajoute un filigrane "DOCUMENT" en diagonale sur toutes les pages du document
 */
export const addDocumentWatermark = (doc: jsPDF, text = "DOCUMENT") => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    applyWatermark(doc, text);
  }
};

/**
 * Applique le filigrane à la page actuelle
 */
export const applyWatermark = (doc: jsPDF, text = "DOCUMENT") => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Sauvegarder l'état actuel du document
  doc.saveGraphicsState();
  
  // Utiliser la méthode correcte pour la manipulation de la matrice de transformation
  doc.setCurrentTransformationMatrix([0.7, 0.7, -0.7, 0.7, pageWidth / 2, pageHeight / 2]);
  
  // Configurer le style du filigrane
  doc.setFont("helvetica", "bold");
  doc.setFontSize(60);
  doc.setTextColor(220, 220, 220); // Gris clair
  
  // Calculer la position du texte
  const textWidth = doc.getTextWidth(text);
  const x = -textWidth / 2;
  const y = 0;
  
  // Ajouter le texte
  doc.text(text, x, y);
  
  // Restaurer l'état précédent
  doc.restoreGraphicsState();
};
