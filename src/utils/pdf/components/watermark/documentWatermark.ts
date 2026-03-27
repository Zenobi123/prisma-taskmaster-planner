
import { jsPDF } from 'jspdf';
import { PDF_THEME } from '../../pdfTheme';

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

  public addWatermark(options: WatermarkOptions): void {
    const { text, angle = -45, fontSize = 60, opacity = 0.15, color = PDF_THEME.watermark } = options;
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;

    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    this.doc.saveGraphicsState();

    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(color);

    const gState = new (this.doc as any).GState({ opacity: opacity });
    this.doc.setGState(gState);

    const textWidth = this.doc.getTextWidth(text);

    this.doc.text(text, centerX, centerY, {
      align: 'center',
      angle: angle,
      renderingMode: 'fill',
    });

    this.doc.restoreGraphicsState();
  }
}
