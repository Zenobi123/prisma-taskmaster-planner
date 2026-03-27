
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture, Prestation } from '../types';
import { PDF_THEME } from '../pdfTheme';

export const addPrestationsTable = (doc: jsPDF, facture: PDFFacture): number => {
  const tableColumn = ["Description", "Quantité", "Montant (F CFA)", "Taux (%)", "Total (F CFA)"];
  const tableRows: string[][] = [];

  facture.prestations.forEach(prestation => {
    const quantite = prestation.quantite || 1;
    const taux = prestation.taux || 0;
    const montantHT = prestation.montant * quantite;
    const montantTTC = montantHT * (1 + taux / 100);

    const row = [
      prestation.description,
      quantite.toString(),
      prestation.montant.toLocaleString('fr-FR'),
      taux.toString(),
      Math.round(montantTTC).toLocaleString('fr-FR')
    ];
    tableRows.push(row);
  });

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
      0: { cellWidth: 70 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: PDF_THEME.bgAlternate
    },
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY || 150;
};

export const addTotalSection = (doc: jsPDF, facture: PDFFacture, finalY: number) => {
  doc.setFillColor(...PDF_THEME.bgPrimary);
  doc.roundedRect(130, finalY + 10, 65, 20, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textHeading);
  doc.text("TOTAL:", 140, finalY + 20);

  doc.setFontSize(12);
  doc.text(`${facture.montant.toLocaleString('fr-FR')} F CFA`, 165, finalY + 20);

  return finalY + 30;
};
