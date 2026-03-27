
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDF_THEME } from '../pdfTheme';

export type DocumentType = 'facture' | 'reçu' | 'rapport' | 'attestation';

export class BaseDocumentService {
  protected doc: jsPDF;
  protected title: string;
  protected reference: string;
  protected documentType: DocumentType;
  protected creationDate: Date;
  protected primaryColor: [number, number, number] = PDF_THEME.primaryDark;
  protected secondaryColor: [number, number, number] = PDF_THEME.primary;
  protected backgroundColor: [number, number, number] = PDF_THEME.bgPrimary;

  constructor(documentType: DocumentType, title: string, reference: string) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    this.documentType = documentType;
    this.title = title;
    this.reference = reference;
    this.creationDate = new Date();

    this.configureDocumentProperties();
  }

  protected configureDocumentProperties(): void {
    this.doc.setProperties({
      title: `${this.title} ${this.reference}`,
      subject: this.title,
      author: 'PRISMA GESTION',
      keywords: `${this.documentType}, ${this.reference}, pdf, prisma`
    });

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...PDF_THEME.textBody);
  }

  public getDocument(): jsPDF {
    return this.doc;
  }

  public addPage(): void {
    this.doc.addPage();
  }

  protected formatGenerationDate(): string {
    return format(this.creationDate, 'dd/MM/yyyy à HH:mm', { locale: fr });
  }
}
