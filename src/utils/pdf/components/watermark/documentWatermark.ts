
import { jsPDF } from "jspdf";

export type WatermarkOptions = {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  angle?: number;
};

/**
 * Ajoute un filigrane au document PDF
 */
export const addWatermark = (doc: jsPDF, options: WatermarkOptions): void => {
  const {
    text,
    fontSize = 60,
    color = '#e0e0e0',
    opacity = 0.3,
    angle = -45
  } = options;
  
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Sauvegarde l'état actuel
    doc.saveGraphicsState();
    
    // Configure le texte
    doc.setTextColor(color);
    doc.setFontSize(fontSize);
    doc.setGState(new doc.GState({ opacity }));
    
    // Position centrée
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    const y = pageHeight / 2;
    
    // Applique la rotation
    doc.translate(x, y);
    doc.rotate(angle);
    
    // Dessine le texte
    doc.text(text, 0, 0);
    
    // Restaure l'état
    doc.restoreGraphicsState();
  }
};
