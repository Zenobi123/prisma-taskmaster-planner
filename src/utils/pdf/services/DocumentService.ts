
import { jsPDF } from "jspdf";
import { DocumentContentService, StandardDocumentContentService } from "./DocumentContentService";
import { DocumentWatermark } from "../components/watermark/documentWatermark";

export interface DocumentHeaderFooterService {
  addStandardHeader(title?: string): void;
  addStandardFooter(): void;
}

export class DocumentService implements DocumentHeaderFooterService {
  private doc: jsPDF;
  private contentService: DocumentContentService;
  private watermarkService: DocumentWatermark;

  constructor() {
    // Create a new jsPDF document with portrait orientation
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    // Initialize services
    this.contentService = new StandardDocumentContentService(this.doc);
    this.watermarkService = new DocumentWatermark(this.doc);
  }

  /**
   * Add a standard header to the document
   */
  public addStandardHeader(title?: string): void {
    // Add company logo at the top
    const pageWidth = this.doc.internal.pageSize.width;
    
    // Company name as header
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("CABINET COMPTABLE EXAMPLE", pageWidth / 2, 15, { align: 'center' });
    
    // Company address and contact
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("123 Avenue des Finances, Douala, Cameroun", pageWidth / 2, 22, { align: 'center' });
    this.doc.text("Tel: +237 123 456 789 | Email: contact@example.com", pageWidth / 2, 26, { align: 'center' });
    
    // Draw a line separator
    this.doc.setLineWidth(0.5);
    this.doc.line(10, 30, pageWidth - 10, 30);

    // Add title if provided
    if (title) {
      this.doc.setFontSize(14);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(title.toUpperCase(), pageWidth / 2, 40, { align: 'center' });
    }
  }

  /**
   * Add a standard footer to the document
   */
  public addStandardFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    
    // Draw a line separator
    this.doc.setLineWidth(0.5);
    this.doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
    
    // Add footer text
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Cabinet Comptable Example - SARL au capital de 1 000 000 FCFA", pageWidth / 2, pageHeight - 10, { align: 'center' });
    this.doc.text("RCCM: AB-XYZ-12-2023 | NIU: P123456789", pageWidth / 2, pageHeight - 6, { align: 'center' });
  }

  /**
   * Get the document instance
   */
  public getDocument(): jsPDF {
    return this.doc;
  }

  /**
   * Get the content service
   */
  public getContentService(): DocumentContentService {
    return this.contentService;
  }

  /**
   * Get the watermark service
   */
  public getWatermarkService(): DocumentWatermark {
    return this.watermarkService;
  }
  
  /**
   * Add a title to the document
   */
  public addTitle(text: string): void {
    this.contentService.addTitle(text);
  }

  /**
   * Add a subtitle to the document
   */
  public addSubtitle(text: string): void {
    this.contentService.addSubtitle(text);
  }

  /**
   * Add a paragraph to the document
   */
  public addParagraph(text: string): void {
    this.contentService.addParagraph(text);
  }

  /**
   * Add a section to the document
   */
  public addSection(title: string, content: string[]): void {
    this.contentService.addSection(title, content);
  }

  /**
   * Save the document with the given filename
   */
  public save(filename: string): void {
    this.doc.save(filename);
  }

  /**
   * Add a watermark to the document
   */
  public addWatermark(text: string): void {
    this.watermarkService.addWatermark({ text });
  }
}
