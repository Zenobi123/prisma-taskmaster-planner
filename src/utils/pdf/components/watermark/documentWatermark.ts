
import { jsPDF } from 'jspdf';

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
   * Adds a text watermark that spans across the entire page
   * @param options The watermark options
   */
  public addWatermark(options: WatermarkOptions): void {
    const { text, angle = -45, fontSize = 60, opacity = 0.15, color = '#888888' } = options;
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;
    
    // Calculate center positions
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    // Save current state
    this.doc.saveGraphicsState();
    
    // Set text properties
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(color);
    
    // Set opacity
    const gState = new (this.doc as any).GState({ opacity: opacity });
    this.doc.setGState(gState);
    
    // Convert angle to radians
    const radians = angle * Math.PI / 180;
    
    // Save current transformation
    this.doc.saveGraphicsState();
    
    // Move to center, rotate, then draw text
    this.doc.translate(centerX, centerY);
    this.doc.rotate(angle);
    
    // Calculate text width to center it
    const textWidth = this.doc.getTextWidth(text);
    
    // Draw the text
    this.doc.text(text, -textWidth / 2, 0, { align: 'center' });
    
    // Restore graphics state
    this.doc.restoreGraphicsState();
  }
}
