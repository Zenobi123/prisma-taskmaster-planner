
import { DocumentType } from './BaseDocumentService';
import { DocumentHeaderFooterService } from './DocumentHeaderFooterService';
import { DocumentContentService } from './DocumentContentService';

export class DocumentService {
  private headerFooterService: DocumentHeaderFooterService;
  private contentService: DocumentContentService;

  constructor(documentType: DocumentType, title: string, reference: string) {
    this.headerFooterService = new DocumentHeaderFooterService(documentType, title, reference);
    this.contentService = new DocumentContentService(documentType, title, reference);
  }

  public addStandardHeader(date?: string): void {
    this.headerFooterService.addStandardHeader(date);
  }

  public addStandardFooter(): void {
    this.headerFooterService.addStandardFooter();
  }

  public addInfoSection(title: string, content: string | string[], startY: number): number {
    return this.contentService.addInfoSection(title, content, startY);
  }

  public addNotesSection(notes: string, startY: number): number {
    return this.contentService.addNotesSection(notes, startY);
  }

  public addAmountSection(label: string, montant: number, startY: number, withCurrency: boolean = true): number {
    return this.contentService.addAmountSection(label, montant, startY, withCurrency);
  }

  public getDocument(): jsPDF {
    return this.headerFooterService.getDocument();
  }

  public addPage(): void {
    this.headerFooterService.addPage();
    this.contentService.addPage();
  }

  public generate(download: boolean = false): Blob | null {
    try {
      if (download) {
        const doc = this.getDocument();
        const formattedDocType = this.headerFooterService['documentType'].charAt(0).toUpperCase() + 
                               this.headerFooterService['documentType'].slice(1);
        doc.save(`${formattedDocType}_${this.headerFooterService['reference'].replace(/\s/g, '_')}.pdf`);
        return doc.output('blob');
      } else {
        const pdfBlob = this.getDocument().output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        return pdfBlob;
      }
    } catch (error) {
      console.error(`Erreur lors de la génération du PDF:`, error);
      throw error;
    }
  }
}

export * from './BaseDocumentService';
