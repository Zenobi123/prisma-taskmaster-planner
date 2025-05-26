
import { jsPDF } from "jspdf";

/**
 * Service pour gérer les en-têtes et pieds de page des documents PDF
 */
export class DocumentHeaderFooterService {
  private doc: jsPDF;
  
  constructor(doc: jsPDF) {
    this.doc = doc;
  }
  
  /**
   * Ajoute un en-tête standard au document
   */
  addStandardHeader(title: string, logoUrl?: string): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    
    // Titre du document
    this.doc.setFontSize(18);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, pageWidth / 2, 20, { align: 'center' });
    
    // Logo si disponible
    if (logoUrl) {
      try {
        this.doc.addImage(logoUrl, 'PNG', 10, 10, 30, 30);
      } catch (error) {
        console.error("Erreur lors de l'ajout du logo:", error);
      }
    }
    
    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(10, 35, pageWidth - 10, 35);
  }
  
  /**
   * Ajoute un pied de page standard au document
   */
  addStandardFooter(pageText?: string): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    
    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
    
    // Numéro de page
    const text = pageText || `Page ${this.doc.getCurrentPageInfo().pageNumber} / ${this.doc.getNumberOfPages()}`;
    this.doc.setFontSize(10);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(text, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  /**
   * Récupère le document PDF
   */
  getDocument(): jsPDF {
    return this.doc;
  }
  
  /**
   * Ajoute une nouvelle page au document
   */
  addPage(): void {
    this.doc.addPage();
  }
}
