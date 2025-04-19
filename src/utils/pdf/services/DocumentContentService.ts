
import { BaseDocumentService, DocumentType } from './BaseDocumentService';

export class DocumentContentService extends BaseDocumentService {
  constructor(documentType: DocumentType, title: string, reference: string) {
    super(documentType, title, reference);
  }

  public addInfoSection(title: string, content: string | string[], startY: number): number {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 15, startY + 5);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    let contentArray: string[];
    if (typeof content === 'string') {
      contentArray = this.doc.splitTextToSize(content, 180);
    } else {
      contentArray = content;
    }
    
    this.doc.text(contentArray, 15, startY + 15);
    
    return startY + 15 + (contentArray.length * 5);
  }

  public addNotesSection(notes: string, startY: number): number {
    if (!notes || notes.trim() === '') return startY;
    
    this.doc.setFillColor(250, 250, 250);
    this.doc.roundedRect(15, startY, 180, 20, 3, 3, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text("Notes:", 20, startY + 7);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    
    const splitNotes = this.doc.splitTextToSize(notes, 160);
    this.doc.text(splitNotes, 20, startY + 14);
    
    return startY + 22;
  }

  public addAmountSection(label: string, montant: number, startY: number, withCurrency: boolean = true): number {
    this.doc.setFillColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2]);
    this.doc.roundedRect(15, startY + 10, 180, 30, 3, 3, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text(label, 25, startY + 25);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    
    const formattedAmount = new Intl.NumberFormat('fr-FR').format(montant);
    this.doc.text(`${formattedAmount}${withCurrency ? ' XAF' : ''}`, 110, startY + 25);
    
    this.doc.setTextColor(60, 60, 60);
    
    return startY + 40;
  }
}
