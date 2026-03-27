
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { addCompanyLogo, addInvoiceInfoBox, addClientSection } from '../pdfComponents';
import { PDF_THEME } from '../pdfTheme';

export const addInvoiceHeader = (doc: jsPDF, facture: PDFFacture) => {
  addCompanyLogo(doc);
  addInvoiceInfoBox(doc, 'FACTURE', facture.id, facture.date);
  addClientSection(doc, facture.client);
  addPaymentDetailsBox(doc, facture);
};

const addPaymentDetailsBox = (doc: jsPDF, facture: PDFFacture) => {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PDF_THEME.textBody);

  doc.setFillColor(...PDF_THEME.bgPrimary);
  doc.roundedRect(120, 90, 75, 30, 3, 3, 'F');

  const formatDateForDisplay = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  doc.text(`Échéance: ${formatDateForDisplay(facture.echeance)}`, 130, 100);
  doc.text(`Montant total: ${facture.montant.toLocaleString('fr-FR')} F CFA`, 130, 107);

  let statusText = "";
  let statusColor: [number, number, number] = PDF_THEME.textHeading;

  const paymentStatus = facture.status_paiement || facture.status;

  if (paymentStatus === 'payée' || paymentStatus === 'payee') {
    statusText = "PAYÉE";
    statusColor = PDF_THEME.statusPaid;
  } else if (paymentStatus === 'partiellement_payée' || paymentStatus === 'partiellement_payee') {
    statusText = "PARTIELLEMENT PAYÉE";
    statusColor = PDF_THEME.statusPartial;
  } else if (paymentStatus === 'en_retard') {
    statusText = "EN RETARD";
    statusColor = PDF_THEME.statusLate;
  } else {
    statusText = "EN ATTENTE";
    statusColor = PDF_THEME.statusPending;
  }

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${statusText}`, 130, 115);
  doc.setTextColor(...PDF_THEME.textHeading);

  doc.setDrawColor(...PDF_THEME.border);
  doc.setLineWidth(0.5);
  doc.line(15, 130, 195, 130);
};
