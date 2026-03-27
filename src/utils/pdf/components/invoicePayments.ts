
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDF_THEME } from '../pdfTheme';

// Function to add the payments section to the invoice
export const addPaymentsSection = (doc: jsPDF, facture: PDFFacture, startY: number): number => {
  if (!facture.paiements || facture.paiements.length === 0) {
    return startY;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...PDF_THEME.textBody);

  const currentY = startY + 10;
  const pageHeight = doc.internal.pageSize.height;
  const remainingSpace = pageHeight - currentY - 40;

  if (remainingSpace < 60) {
    doc.addPage();
    return addPaymentsSection(doc, facture, 20);
  }

  doc.text("Historique des paiements", 15, currentY);

  const tableTop = currentY + 10;
  const leftMargin = 15;
  const colWidths = [50, 45, 45, 45];

  doc.setFillColor(...PDF_THEME.bgLight);
  doc.rect(leftMargin, tableTop, colWidths.reduce((a, b) => a + b, 0), 10, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...PDF_THEME.textSecondary);
  doc.text("Date", leftMargin + 5, tableTop + 7);
  doc.text("Mode", leftMargin + colWidths[0] + 5, tableTop + 7);
  doc.text("Référence", leftMargin + colWidths[0] + colWidths[1] + 5, tableTop + 7);
  doc.text("Montant", leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 7);

  doc.setFont('helvetica', 'normal');
  let rowY = tableTop + 10;

  facture.paiements.forEach((paiement, i) => {
    if (rowY + 10 > pageHeight - 40) {
      doc.addPage();
      rowY = 20;

      doc.setFillColor(...PDF_THEME.bgLight);
      doc.rect(leftMargin, rowY, colWidths.reduce((a, b) => a + b, 0), 10, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...PDF_THEME.textSecondary);
      doc.text("Date", leftMargin + 5, rowY + 7);
      doc.text("Mode", leftMargin + colWidths[0] + 5, rowY + 7);
      doc.text("Référence", leftMargin + colWidths[0] + colWidths[1] + 5, rowY + 7);
      doc.text("Montant", leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + 5, rowY + 7);

      doc.setFont('helvetica', 'normal');
      rowY += 10;
    }

    if (i % 2 === 0) {
      doc.setFillColor(...PDF_THEME.bgAlternate);
      doc.rect(leftMargin, rowY, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
    }

    let formattedDate = paiement.date;
    try {
      formattedDate = format(parseISO(paiement.date), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      console.error("Error formatting date", e);
    }

    const formattedAmount = new Intl.NumberFormat('fr-FR').format(paiement.montant);

    doc.text(formattedDate, leftMargin + 5, rowY + 7);
    doc.text(paiement.mode, leftMargin + colWidths[0] + 5, rowY + 7);
    doc.text(paiement.reference || "-", leftMargin + colWidths[0] + colWidths[1] + 5, rowY + 7);

    const amountText = `${formattedAmount} F CFA`;
    doc.text(amountText, leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + 5, rowY + 7);

    rowY += 10;
  });

  doc.setDrawColor(...PDF_THEME.border);
  doc.setLineWidth(0.5);
  const tableHeight = Math.min(10 + facture.paiements.length * 10, rowY - tableTop);
  doc.rect(leftMargin, tableTop, colWidths.reduce((a, b) => a + b, 0), tableHeight);

  for (let i = 1; i < colWidths.length; i++) {
    const x = leftMargin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.line(x, tableTop, x, tableTop + tableHeight);
  }

  doc.line(leftMargin, tableTop + 10, leftMargin + colWidths.reduce((a, b) => a + b, 0), tableTop + 10);

  return rowY + 10;
};
