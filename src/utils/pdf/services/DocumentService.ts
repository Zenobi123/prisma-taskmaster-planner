
import { jsPDF } from "jspdf";
import { DocumentHeaderFooterService } from "./DocumentHeaderFooterService";
import { DocumentContentService } from "./DocumentContentService";

/**
 * Service principal pour la génération de documents PDF
 */
export class DocumentService {
  private doc: jsPDF;
  private headerFooterService: DocumentHeaderFooterService;
  private contentService: DocumentContentService;

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });
    
    this.headerFooterService = new DocumentHeaderFooterService(this.doc);
    this.contentService = new DocumentContentService(this.doc);
  }

  /**
   * Ajoute un en-tête standard au document
   */
  addStandardHeader(title: string, logoUrl?: string): DocumentService {
    this.headerFooterService.addStandardHeader(title, logoUrl);
    return this;
  }

  /**
   * Ajoute un pied de page standard au document
   */
  addStandardFooter(pageText?: string): DocumentService {
    this.headerFooterService.addStandardFooter(pageText);
    return this;
  }

  /**
   * Ajoute un titre au document
   */
  addTitle(title: string, marginTop: number = 40): DocumentService {
    this.contentService.addTitle(title, marginTop);
    return this;
  }

  /**
   * Ajoute un sous-titre au document
   */
  addSubtitle(subtitle: string, marginTop: number = 5): DocumentService {
    this.contentService.addSubtitle(subtitle, marginTop);
    return this;
  }

  /**
   * Ajoute un paragraphe de texte
   */
  addParagraph(text: string, marginTop: number = 10): DocumentService {
    this.contentService.addParagraph(text, marginTop);
    return this;
  }

  /**
   * Ajoute une liste à puces
   */
  addBulletList(items: string[], marginTop: number = 10): DocumentService {
    this.contentService.addBulletList(items, marginTop);
    return this;
  }

  /**
   * Ajoute une section avec un titre et du contenu
   */
  addSection(title: string, content: string, marginTop: number = 10): DocumentService {
    this.contentService.addSection(title, content, marginTop);
    return this;
  }

  /**
   * Ajoute une nouvelle page au document
   */
  addPage(): DocumentService {
    this.headerFooterService.addPage();
    return this;
  }

  /**
   * Obtient le document PDF généré
   */
  getDocument(): jsPDF {
    return this.headerFooterService.getDocument();
  }

  /**
   * Enregistre le document avec le nom spécifié
   */
  save(filename: string = 'document.pdf'): void {
    this.doc.save(filename);
  }

  /**
   * Génère l'URL du document
   */
  output(): string {
    return this.doc.output('datauristring');
  }
}
