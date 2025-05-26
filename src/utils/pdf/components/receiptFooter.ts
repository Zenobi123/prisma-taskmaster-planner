
import { jsPDF } from "jspdf";
import { DocumentWatermark, WatermarkOptions } from "./watermark/documentWatermark";

export class ReceiptFooter {
  private doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  /**
   * Adds a standard footer to the receipt
   */
  public addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    const companyName = "CABINET COMPTABLE EXAMPLE";
    
    // Add page numbers
    const pageInfo = `Page ${this.doc.getCurrentPageInfo().pageNumber}/${this.doc.getNumberOfPages()}`;
    this.doc.setFontSize(8);
    this.doc.setTextColor(100);
    this.doc.text(pageInfo, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Add company info at the bottom
    this.doc.setFontSize(6);
    this.doc.setTextColor(120);
    this.doc.text(companyName, pageWidth / 2, pageHeight - 7, { align: 'center' });
    
    // Add auto-generated text
    const generatedText = "Document généré automatiquement - Tous droits réservés";
    this.doc.text(generatedText, pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  /**
   * Adds a watermark to the document
   */
  public addWatermark(watermarkService: DocumentWatermark): void {
    const watermarkOptions: WatermarkOptions = {
      text: "REÇU",
      angle: -40,
      fontSize: 80,
      opacity: 0.12,
      color: '#888888'
    };
    watermarkService.addWatermark(watermarkOptions);
  }
}
