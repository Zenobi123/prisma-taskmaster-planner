
import { jsPDF } from "jspdf";
import { DocumentWatermark, WatermarkOptions } from "./watermark/documentWatermark";
import { PDF_THEME } from '../pdfTheme';

export class InvoiceFooter {
  private doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  public addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    const companyName = "CABINET COMPTABLE EXAMPLE";

    const pageInfo = `Page ${this.doc.getCurrentPageInfo().pageNumber}/${this.doc.getNumberOfPages()}`;
    this.doc.setFontSize(8);
    this.doc.setTextColor(...PDF_THEME.textSecondary);
    this.doc.text(pageInfo, pageWidth / 2, pageHeight - 10, { align: 'center' });

    this.doc.setFontSize(6);
    this.doc.setTextColor(...PDF_THEME.textMuted);
    this.doc.text(companyName, pageWidth / 2, pageHeight - 7, { align: 'center' });

    const generatedText = "Document généré automatiquement - Tous droits réservés";
    this.doc.text(generatedText, pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  public addWatermark(watermarkService: DocumentWatermark): void {
    const watermarkOptions: WatermarkOptions = {
      text: "FACTURE",
      angle: -40,
      fontSize: 80,
      opacity: 0.12,
      color: PDF_THEME.watermark
    };
    watermarkService.addWatermark(watermarkOptions);
  }
}
