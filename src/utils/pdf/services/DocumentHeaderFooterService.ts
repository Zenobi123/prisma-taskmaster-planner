
import jsPDF from 'jspdf';
import { addCompanyLogo, formatDateForDisplay } from '../pdfComponents';
import { BaseDocumentService, DocumentType } from './BaseDocumentService';

export class DocumentHeaderFooterService extends BaseDocumentService {
  constructor(documentType: DocumentType, title: string, reference: string) {
    super(documentType, title, reference);
  }

  public addStandardHeader(date?: string): void {
    addCompanyLogo(this.doc);
    
    this.doc.setFillColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2]);
    this.doc.roundedRect(120, 15, 75, 30, 3, 3, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    
    const formattedTitle = this.documentType.charAt(0).toUpperCase() + this.documentType.slice(1);
    this.doc.text(formattedTitle, 130, 25);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`N° ${this.reference}`, 130, 32);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Date: ${date || formatDateForDisplay(new Date().toISOString())}`, 130, 38);
    
    this.doc.setTextColor(60, 60, 60);
  }

  public addStandardFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      const pageHeight = this.doc.internal.pageSize.height;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 15);
      this.doc.text(`${this.title} ${this.reference} - Page ${i}/${pageCount}`, 170, pageHeight - 15);
      this.doc.text(`Document généré le ${this.formatGenerationDate()}`, 15, pageHeight - 10);
      
      this.addWatermark('PRISMA GESTION');
    }
  }

  private addWatermark(text: string): void {
    this.doc.saveGraphicsState();
    
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;
    
    (this.doc as any).translate(pageWidth/2, pageHeight/2);
    (this.doc as any).rotate(-45);
    
    this.doc.setTextColor(235, 235, 235);
    this.doc.setFontSize(30);
    this.doc.text(text, 0, 0, { align: 'center' });
    
    this.doc.restoreGraphicsState();
  }
}
