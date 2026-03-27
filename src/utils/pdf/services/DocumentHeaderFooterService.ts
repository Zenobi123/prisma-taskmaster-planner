
import { jsPDF } from "jspdf";
import { PDF_THEME } from '../pdfTheme';

/**
 * Service pour gérer les en-têtes et pieds de page des documents PDF
 */
export class DocumentHeaderFooterService {
  private doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  addStandardHeader(title: string, logoUrl?: string): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();

    this.doc.setFontSize(18);
    this.doc.setTextColor(...PDF_THEME.textHeading);
    this.doc.text(title, pageWidth / 2, 20, { align: 'center' });

    if (logoUrl) {
      try {
        this.doc.addImage(logoUrl, 'PNG', 10, 10, 30, 30);
      } catch (error) {
        console.error("Erreur lors de l'ajout du logo:", error);
      }
    }

    this.doc.setDrawColor(...PDF_THEME.border);
    this.doc.line(10, 35, pageWidth - 10, 35);
  }

  addStandardFooter(pageText?: string): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();

    this.doc.setDrawColor(...PDF_THEME.border);
    this.doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);

    const text = pageText || `Page ${this.doc.getCurrentPageInfo().pageNumber} / ${this.doc.getNumberOfPages()}`;
    this.doc.setFontSize(10);
    this.doc.setTextColor(...PDF_THEME.textMuted);
    this.doc.text(text, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  getDocument(): jsPDF {
    return this.doc;
  }

  addPage(): void {
    this.doc.addPage();
  }
}
