
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { addCompanyLogo, formatDateForDisplay } from './pdfComponents';

/**
 * Service centralisé pour la création de documents PDF de haute qualité
 */
export class DocumentService {
  private doc: jsPDF;
  private title: string;
  private reference: string;
  private documentType: 'facture' | 'reçu' | 'rapport' | 'attestation';
  private creationDate: Date;
  private primaryColor: [number, number, number] = [60, 98, 85]; // PRISMA vert
  private secondaryColor: [number, number, number] = [132, 169, 140]; // PRISMA vert clair
  private backgroundColor: [number, number, number] = [240, 248, 240]; // Vert très pâle

  /**
   * Crée un nouveau service de document
   * @param documentType Type du document à générer
   * @param title Titre du document
   * @param reference Référence du document
   */
  constructor(
    documentType: 'facture' | 'reçu' | 'rapport' | 'attestation',
    title: string,
    reference: string
  ) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    this.documentType = documentType;
    this.title = title;
    this.reference = reference;
    this.creationDate = new Date();
    
    // Configurer les propriétés du document
    this.configureDocumentProperties();
  }

  /**
   * Configure les métadonnées du document PDF
   */
  private configureDocumentProperties(): void {
    // Définir les propriétés du document
    this.doc.setProperties({
      title: `${this.title} ${this.reference}`,
      subject: this.title,
      author: 'PRISMA GESTION',
      keywords: `${this.documentType}, ${this.reference}, pdf, prisma`
    });
    
    // Définir les polices et couleurs par défaut
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(60, 60, 60);
  }

  /**
   * Ajoute l'en-tête de base avec logo et informations du document
   * @param date Date du document à afficher
   */
  public addStandardHeader(date?: string): void {
    // Ajouter le logo et les informations de l'entreprise
    addCompanyLogo(this.doc);
    
    // Créer une boîte pour les informations du document
    this.doc.setFillColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2]);
    this.doc.roundedRect(120, 15, 75, 30, 3, 3, 'F');
    
    // Ajouter le titre et les détails
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    
    // Convertir la première lettre en majuscule
    const formattedTitle = this.documentType.charAt(0).toUpperCase() + this.documentType.slice(1);
    this.doc.text(formattedTitle, 130, 25);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`N° ${this.reference}`, 130, 32);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Date: ${date || formatDateForDisplay(new Date().toISOString())}`, 130, 38);
    
    // Réinitialiser les styles
    this.doc.setTextColor(60, 60, 60);
  }

  /**
   * Ajoute un pied de page standard avec numérotation et date de génération
   */
  public addStandardFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      const pageHeight = this.doc.internal.pageSize.height;
      
      // Bas de page
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 15);
      
      // Pied de page droit avec numéros de page
      this.doc.text(`${this.title} ${this.reference} - Page ${i}/${pageCount}`, 170, pageHeight - 15);
      
      // Ajouter la date de génération
      const generateDate = format(this.creationDate, 'dd/MM/yyyy à HH:mm', { locale: fr });
      this.doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 10);
      
      // Ajouter un filigrane en diagonale avec couleur très claire
      this.addWatermark('PRISMA GESTION');
    }
  }

  /**
   * Ajoute un filigrane en diagonale
   * @param text Texte du filigrane
   */
  private addWatermark(text: string): void {
    this.doc.saveGraphicsState();
    
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;
    
    // Positionner au centre et faire pivoter
    (this.doc as any).translate(pageWidth/2, pageHeight/2);
    (this.doc as any).rotate(-45);
    
    this.doc.setTextColor(235, 235, 235);
    this.doc.setFontSize(30);
    this.doc.text(text, 0, 0, { align: 'center' });
    
    this.doc.restoreGraphicsState();
  }

  /**
   * Ajoute une section de notes avec arrière-plan
   * @param notes Texte des notes
   * @param startY Position Y de départ
   * @returns Nouvelle position Y après la section
   */
  public addNotesSection(notes: string, startY: number): number {
    if (!notes || notes.trim() === '') return startY;
    
    // Dessiner l'arrière-plan
    this.doc.setFillColor(250, 250, 250);
    this.doc.roundedRect(15, startY, 180, 20, 3, 3, 'F');
    
    // Titre Notes
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text("Notes:", 20, startY + 7);
    
    // Contenu des notes
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    
    // Gérer les notes multiligne
    const splitNotes = this.doc.splitTextToSize(notes, 160);
    this.doc.text(splitNotes, 20, startY + 14);
    
    return startY + 22;
  }

  /**
   * Ajoute une section de montant avec arrière-plan
   * @param label Libellé du montant
   * @param montant Montant à afficher
   * @param startY Position Y de départ
   * @param withCurrency Afficher la devise XAF
   * @returns Nouvelle position Y après la section
   */
  public addAmountSection(label: string, montant: number, startY: number, withCurrency: boolean = true): number {
    // Dessiner l'arrière-plan
    this.doc.setFillColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2]);
    this.doc.roundedRect(15, startY + 10, 180, 30, 3, 3, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text(label, 25, startY + 25);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    
    // Formater le montant avec séparateurs de milliers
    const formattedAmount = new Intl.NumberFormat('fr-FR').format(montant);
    this.doc.text(`${formattedAmount}${withCurrency ? ' XAF' : ''}`, 110, startY + 25);
    
    // Réinitialiser les styles
    this.doc.setTextColor(60, 60, 60);
    
    return startY + 40;
  }

  /**
   * Ajoute une section avec titre et contenu
   * @param title Titre de la section
   * @param content Contenu à afficher
   * @param startY Position Y de départ
   * @returns Nouvelle position Y après la section
   */
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

  /**
   * Génère le PDF et le renvoie ou le télécharge
   * @param download Si true, télécharger le PDF, sinon l'ouvrir dans un nouvel onglet
   * @returns Blob du PDF si download=true, sinon null
   */
  public generate(download: boolean = false): Blob | null {
    try {
      if (download) {
        // Télécharger le PDF
        const formattedDocType = this.documentType.charAt(0).toUpperCase() + this.documentType.slice(1);
        this.doc.save(`${formattedDocType}_${this.reference.replace(/\s/g, '_')}.pdf`);
        return this.doc.output('blob');
      } else {
        // Créer un blob et l'ouvrir dans un nouvel onglet
        const pdfBlob = this.doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        return pdfBlob;
      }
    } catch (error) {
      console.error(`Erreur lors de la génération du PDF:`, error);
      throw error;
    }
  }

  /**
   * Ajoute une nouvelle page au document
   */
  public addPage(): void {
    this.doc.addPage();
  }

  /**
   * Récupère l'objet jsPDF pour des manipulations avancées
   */
  public getDocument(): jsPDF {
    return this.doc;
  }
}

/**
 * Fonction utilitaire pour convertir une chaîne RGB en tableau de nombres
 * @param rgbString Chaîne au format 'rgb(r, g, b)'
 * @returns Tableau [r, g, b]
 */
export function rgbStringToArray(rgbString: string): [number, number, number] {
  const matches = rgbString.match(/\d+/g);
  if (matches && matches.length >= 3) {
    return [parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2])];
  }
  return [0, 0, 0];
}
