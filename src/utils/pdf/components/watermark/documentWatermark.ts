
import { jsPDF } from "jspdf";

export interface WatermarkOptions {
  text: string;
  angle?: number;
  fontSize?: number;
  opacity?: number;
  color?: string;
}

export class DocumentWatermark {
  private doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  /**
   * Adds a watermark to the document
   * @param options Watermark options or text string
   */
  public addWatermark(options: WatermarkOptions | string): void {
    // If options is a string, convert it to WatermarkOptions
    const watermarkOptions: WatermarkOptions = typeof options === 'string' 
      ? { text: options } 
      : options;
    
    const {
      text,
      angle = -45,
      fontSize = 60,
      opacity = 0.2,
      color = '#888888'
    } = watermarkOptions;
    
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    
    // Save the current state
    this.doc.saveGraphicsState();
    
    // Set the text properties
    this.doc.setTextColor(color);
    this.doc.setFontSize(fontSize);
    this.doc.setGState(this.doc.addGState({ opacity }));
    
    // Position in the center of the page
    const x = pageWidth / 2;
    const y = pageHeight / 2;
    
    // Save transform state
    this.doc.saveGraphicsState();
    
    // Apply transformations manually for jsPDF v3+
    // Using matrix transformations instead of translateY/translateX/rotate
    const radians = angle * (Math.PI / 180);
    this.doc.applyTransformation({
      a: Math.cos(radians),
      b: Math.sin(radians),
      c: -Math.sin(radians),
      d: Math.cos(radians),
      e: x,
      f: y
    });
    
    // Draw the text
    const textWidth = this.doc.getStringUnitWidth(text) * fontSize / this.doc.internal.scaleFactor;
    this.doc.text(text, -textWidth / 2, 0, { align: 'center' });
    
    // Restore the states
    this.doc.restoreGraphicsState();
    this.doc.restoreGraphicsState();
  }
}
