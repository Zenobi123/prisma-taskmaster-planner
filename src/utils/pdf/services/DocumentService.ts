
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
   * Ajoute un en-tête standard au document avec logo optionnel
   */
  addStandardHeader(title?: string, logoUrl?: string): DocumentService {
    if (title) {
      this.headerFooterService.addHeader(title, logoUrl);
    } else {
      this.headerFooterService.addHeader("Document", logoUrl);
    }
    return this;
  }

  /**
   * Ajoute un pied de page standard au document
   */
  addStandardFooter(pageText?: string): DocumentService {
    this.headerFooterService.addFooter(pageText);
    return this;
  }

  /**
   * Ajoute un titre au document
   */
  addTitle(title: string, marginTop: number = 40): DocumentService {
    this.contentService.addText(title, marginTop, 16, 'bold');
    return this;
  }

  /**
   * Ajoute un sous-titre au document
   */
  addSubtitle(subtitle: string, marginTop: number = 5): DocumentService {
    this.contentService.addText(subtitle, marginTop, 14, 'normal');
    return this;
  }

  /**
   * Ajoute un paragraphe de texte
   */
  addParagraph(text: string, marginTop: number = 10): DocumentService {
    this.contentService.addText(text, marginTop, 11, 'normal');
    return this;
  }

  /**
   * Ajoute une liste à puces
   */
  addBulletList(items: string[], marginTop: number = 10): DocumentService {
    this.contentService.addList(items, marginTop);
    return this;
  }

  /**
   * Ajoute une section avec un titre et du contenu
   */
  addSection(title: string, content: string, marginTop: number = 10): DocumentService {
    this.contentService.addText(title, marginTop, 12, 'bold');
    this.contentService.addText(content, 5, 11, 'normal');
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

  /**
   * Méthodes complémentaires pour compatibilité avec le code existant
   */
  
  // Méthode pour ajouter un en-tête de document
  addHeader(title: string, logoUrl?: string): void {
    this.headerFooterService.addHeader(title, logoUrl);
  }

  // Méthode pour ajouter un pied de page
  addFooter(text?: string): void {
    this.headerFooterService.addFooter(text);
  }

  // Méthode pour télécharger le document
  download(filename: string): void {
    this.doc.save(filename);
  }

  // Méthode pour générer le document (URL data ou téléchargement)
  generate(download: boolean = false): string | void {
    if (download) {
      this.doc.save('document.pdf');
      return;
    }
    return this.doc.output('datauristring');
  }

  // Méthode pour ajouter une section d'informations
  addInfoSection(title: string, lines: string[], yPosition: number): number {
    return this.contentService.addInfoBox(title, lines, yPosition);
  }

  // Méthode pour ajouter une section de montant
  addAmountSection(title: string, amount: number, yPosition: number, highlight: boolean = false): number {
    return this.contentService.addAmountBox(title, amount, yPosition, highlight);
  }

  // Méthode pour ajouter une section de notes
  addNotesSection(notes: string, yPosition: number): number {
    return this.contentService.addNotesBox(notes, yPosition);
  }
}
