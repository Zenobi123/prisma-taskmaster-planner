import jsPDF from 'jspdf';
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

  public addInfoSection(title: string, lines: any[], yPosition: number): number {
    const doc = this.getDocument();
    
    // Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text(title, 20, yPosition);
    
    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let currentY = yPosition + 8;
    
    // Process each line, handling objects and complex structures
    lines.forEach((line, index) => {
      // If line is an object (like an address), try to format it as a string
      if (typeof line === 'object' && line !== null) {
        // If it's an address object with ville, quartier properties
        if ('ville' in line && 'quartier' in line) {
          const addressParts = [];
          if (line.ville) addressParts.push(line.ville);
          if (line.quartier) addressParts.push(line.quartier);
          if (line.lieuDit) addressParts.push(line.lieuDit);
          
          doc.text(addressParts.join(', '), 20, currentY);
        } 
        // If it's a contact object
        else if ('telephone' in line || 'email' in line) {
          const contactParts = [];
          if (line.telephone) contactParts.push(`Tel: ${line.telephone}`);
          if (line.email) contactParts.push(`Email: ${line.email}`);
          
          doc.text(contactParts.join(' | '), 20, currentY);
        }
        // For other objects, try to stringify
        else {
          doc.text(JSON.stringify(line), 20, currentY);
        }
      } 
      // If it's a string or other primitive, just display it
      else {
        doc.text(String(line), 20, currentY);
      }
      
      currentY += 7;
    });
    
    return currentY + 5;
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
