
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/utils/formatUtils";

/**
 * Service pour gérer le contenu du document PDF
 */
export class DocumentContentService {
  private doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  /**
   * Ajoute du texte au document avec le style spécifié
   */
  addText(text: string, marginTop: number = 10, fontSize: number = 12, style: 'normal' | 'bold' | 'italic' = 'normal'): void {
    const y = this.getCurrentY() + marginTop;
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', style);
    this.doc.text(text, 15, y);
  }

  /**
   * Ajoute une liste à puces
   */
  addList(items: string[], marginTop: number = 10): void {
    let y = this.getCurrentY() + marginTop;
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    items.forEach(item => {
      this.doc.text('• ', 15, y);
      this.doc.text(item, 20, y);
      y += 7; // Espacement entre les éléments de la liste
    });
  }

  /**
   * Obtient la position Y actuelle (dernière ligne écrite)
   */
  getCurrentY(): number {
    return this.doc.lastAutoTable ? (this.doc as any).lastAutoTable.finalY : 40;
  }

  /**
   * Ajoute une boîte d'informations avec titre et lignes de texte
   */
  addInfoBox(title: string, lines: string[], yPosition: number): number {
    // Fond gris clair pour la boîte
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(15, yPosition, 180, 30 + (lines.length * 6), 'F');
    
    // Titre de la boîte
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text(title, 20, yPosition + 10);
    
    // Lignes d'information
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    let y = yPosition + 20;
    
    lines.forEach(line => {
      if (line) { // Vérifier que la ligne n'est pas vide
        this.doc.text(line, 20, y);
        y += 6;
      }
    });
    
    return y + 10; // Retourner la position Y finale + marge
  }

  /**
   * Ajoute une boîte de montant avec mise en évidence optionnelle
   */
  addAmountBox(title: string, amount: number, yPosition: number, highlight: boolean = false): number {
    // Couleur de fond selon l'option de mise en évidence
    if (highlight) {
      this.doc.setFillColor(70, 130, 180); // Bleu pour la mise en évidence
    } else {
      this.doc.setFillColor(245, 245, 245); // Gris clair par défaut
    }
    
    // Dessiner le rectangle de fond
    this.doc.rect(15, yPosition, 180, 30, 'F');
    
    // Style du texte selon la mise en évidence
    if (highlight) {
      this.doc.setTextColor(255, 255, 255); // Texte blanc sur fond bleu
    } else {
      this.doc.setTextColor(60, 60, 60); // Texte gris foncé sur fond gris clair
    }
    
    // Titre du montant
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, yPosition + 12);
    
    // Montant formaté
    try {
      const formattedAmount = formatCurrency(amount);
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(formattedAmount, 175, yPosition + 20, { align: 'right' });
    } catch (error) {
      // Fallback si le formatage échoue
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${amount} XAF`, 175, yPosition + 20, { align: 'right' });
    }
    
    // Réinitialiser la couleur du texte
    this.doc.setTextColor(0, 0, 0);
    
    return yPosition + 40; // Retourner la position Y finale + marge
  }

  /**
   * Ajoute une boîte de notes
   */
  addNotesBox(notes: string, yPosition: number): number {
    if (!notes || notes.trim() === '') {
      return yPosition; // Ne rien faire si pas de notes
    }
    
    // Fond de la boîte de notes
    this.doc.setFillColor(250, 250, 250);
    
    // Calculer la hauteur nécessaire (estimation)
    const lineHeight = 6;
    const maxWidth = 170; // Largeur max pour le texte
    const noteLines = this.doc.splitTextToSize(notes, maxWidth);
    const boxHeight = 20 + (noteLines.length * lineHeight);
    
    // Dessiner le fond
    this.doc.rect(15, yPosition, 180, boxHeight, 'F');
    
    // Titre de la section
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text("Notes:", 20, yPosition + 10);
    
    // Contenu des notes
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(100, 100, 100);
    
    // Ajouter chaque ligne de texte
    let y = yPosition + 20;
    noteLines.forEach(line => {
      this.doc.text(line, 20, y);
      y += lineHeight;
    });
    
    // Réinitialiser les couleurs
    this.doc.setTextColor(0, 0, 0);
    
    return yPosition + boxHeight + 10; // Position Y finale + marge
  }
}
