import { jsPDF } from "jspdf";
import { applyWatermark } from "../components/watermark/documentWatermark";

/**
 * Service pour gérer les en-têtes et pieds de page des documents
 */
export class DocumentHeaderFooterService {
  protected doc: jsPDF;
  protected pageWidth: number;
  protected pageHeight: number;
  protected margin: number;
  protected pageCount: number = 0;
  protected companyInfo: Record<string, string>;
  protected documentTitle: string;
  protected watermarkText: string;
  protected showWatermark: boolean;

  constructor(
    doc: jsPDF,
    companyInfo: Record<string, string>,
    documentTitle: string,
    showWatermark: boolean = false,
    watermarkText: string = "BROUILLON"
  ) {
    this.doc = doc;
    this.pageWidth = doc.internal.pageSize.getWidth();
    this.pageHeight = doc.internal.pageSize.getHeight();
    this.margin = 15;
    this.companyInfo = companyInfo;
    this.documentTitle = documentTitle;
    this.watermarkText = watermarkText;
    this.showWatermark = showWatermark;
  }

  /**
   * Ajouter l'en-tête au document
   */
  public addHeader(pageNumber?: number): void {
    // Aller à la page spécifiée si pageNumber est fourni
    if (pageNumber) {
      this.doc.setPage(pageNumber);
    }

    this.doc.setFontSize(10);
    this.doc.setTextColor(40);
    this.doc.setFont("helvetica", "normal");

    // Position de l'en-tête (en haut à droite)
    const x = this.pageWidth - this.margin;
    const y = this.margin;

    // Ajouter le logo de l'entreprise (à gauche)
    // this.doc.addImage(this.companyInfo.logo, 'PNG', this.margin, y - 5, 30, 15);

    // Ajouter les informations de l'entreprise (à droite)
    this.doc.text(this.companyInfo.name, x, y, { align: "right" });
    this.doc.text(this.companyInfo.address, x, y + 5, { align: "right" });
  }

  /**
   * Ajouter le pied de page au document
   */
  public addFooter(pageNumber?: number): void {
    // Aller à la page spécifiée si pageNumber est fourni
    if (pageNumber) {
      this.doc.setPage(pageNumber);
    }

    this.doc.setFontSize(10);
    this.doc.setTextColor(40);
    this.doc.setFont("helvetica", "normal");

    // Position du pied de page (en bas au centre)
    const x = this.pageWidth / 2;
    const y = this.pageHeight - this.margin;

    // Ajouter le numéro de page et le titre du document
    this.doc.text(`${this.documentTitle} - Page ${pageNumber}`, x, y - 10, { align: "center" });
    this.doc.text(`© ${new Date().getFullYear()} ${this.companyInfo.name}`, x, y, { align: "center" });
  }

  /**
   * Ajouter un filigrane (watermark) à toutes les pages
   */
  public addWatermark(): void {
    if (!this.showWatermark) return;

    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      applyWatermark(this.doc, this.watermarkText);
    }
  }

  /**
   * Préparer toutes les pages avec les en-têtes et pieds de page
   */
  public prepareAllPages(): void {
    const totalPages = this.doc.getNumberOfPages();
    
    // Parcourir toutes les pages et ajouter l'en-tête et le pied de page
    for (let i = 1; i <= totalPages; i++) {
      this.addHeader(i);
      this.addFooter(i);
    }
    
    // Ajouter un filigrane si nécessaire
    if (this.showWatermark) {
      this.addWatermark();
    }
  }
}
