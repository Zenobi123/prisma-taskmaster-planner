
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture } from '../types';
import { PDF_THEME } from '../pdfTheme';

export const generatePrestationsTable = (doc: jsPDF, facture: PDFFacture): number => {
  const tableColumn = ["Description", "Type", "Qté", "P.U. (F CFA)", "Montant (F CFA)"];
  const tableRows = facture.prestations.map(prestation => {
    const quantite = prestation.quantite || 1;
    const montant = prestation.prix_unitaire
      ? prestation.prix_unitaire * quantite
      : prestation.montant * quantite;
    const typeLabel = (prestation as any).type === "impot" ? "Impôt" : "Honoraire";

    return [
      prestation.description,
      typeLabel,
      quantite.toString(),
      (prestation.prix_unitaire || prestation.montant).toLocaleString('fr-FR'),
      Math.round(montant).toLocaleString('fr-FR')
    ];
  });

  try {
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 135,
      theme: 'grid',
      headStyles: {
        fillColor: PDF_THEME.primaryDark,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: PDF_THEME.border,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: PDF_THEME.bgAlternate
      },
      margin: { left: 15, right: 15 }
    });
  } catch (error) {
    console.error("Erreur pendant la génération du tableau:", error);
    const defaultY = 150;
    doc.text("Erreur lors de la génération du tableau des prestations", 15, defaultY);
    return defaultY + 10;
  }

  let finalY = (doc as any).lastAutoTable.finalY || 150;

  // Add subtotals by type (Impôts / Honoraires)
  const impots = facture.prestations
    .filter((p: any) => p.type === "impot")
    .reduce((sum, p) => sum + (p.prix_unitaire ? p.prix_unitaire * (p.quantite || 1) : p.montant * (p.quantite || 1)), 0);
  const honoraires = facture.prestations
    .filter((p: any) => p.type === "honoraire")
    .reduce((sum, p) => sum + (p.prix_unitaire ? p.prix_unitaire * (p.quantite || 1) : p.montant * (p.quantite || 1)), 0);

  if (impots > 0 || honoraires > 0) {
    finalY += 8;
    const rightX = 195;

    doc.setFontSize(9);
    doc.setTextColor(...PDF_THEME.textBody);

    if (impots > 0) {
      doc.text("Total Impôts :", rightX - 60, finalY, { align: 'right' });
      doc.text(Math.round(impots).toLocaleString('fr-FR') + " F CFA", rightX, finalY, { align: 'right' });
      finalY += 6;
    }

    if (honoraires > 0) {
      doc.text("Total Honoraires :", rightX - 60, finalY, { align: 'right' });
      doc.text(Math.round(honoraires).toLocaleString('fr-FR') + " F CFA", rightX, finalY, { align: 'right' });
      finalY += 6;
    }
  }

  return finalY;
};
