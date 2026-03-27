
import jsPDF from 'jspdf';
import { PDF_THEME } from '../pdfTheme';

// Add payment details section to the receipt PDF
export const addReceiptPaymentDetails = (doc: jsPDF, paiement: any): number => {
  doc.setFillColor(...PDF_THEME.bgLight);
  doc.roundedRect(15, 105, 180, 50, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...PDF_THEME.textBody);
  doc.text('Client:', 25, 115);
  doc.setFont('helvetica', 'normal');

  let clientName = "Client";

  if (paiement.client) {
    if (typeof paiement.client === 'object') {
      clientName = paiement.client.nom || paiement.client.raisonsociale || "Client";
    } else if (typeof paiement.client === 'string') {
      clientName = paiement.client;
    }
  }

  console.log("Client name for receipt:", clientName, "Client object:", paiement.client);

  doc.text(clientName, 60, 115);

  doc.setFont('helvetica', 'bold');
  doc.text('Référence:', 25, 125);
  doc.setFont('helvetica', 'normal');
  doc.text(paiement.reference || paiement.id, 60, 125);

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 25, 135);
  doc.setFont('helvetica', 'normal');

  const formattedDate = formatPaymentDate(paiement.date);
  doc.text(formattedDate, 60, 135);

  doc.setFont('helvetica', 'bold');
  doc.text('Mode:', 25, 145);
  doc.setFont('helvetica', 'normal');
  doc.text(paiement.mode, 60, 145);

  if (paiement.facture) {
    doc.setFont('helvetica', 'bold');
    doc.text('Facture associée:', 115, 115);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.facture, 170, 115);
  }

  if (paiement.reference_transaction) {
    doc.setFont('helvetica', 'bold');
    doc.text('Réf. transaction:', 115, 125);
    doc.setFont('helvetica', 'normal');
    doc.text(paiement.reference_transaction, 170, 125);
  }

  if (paiement.est_credit) {
    doc.setFont('helvetica', 'bold');
    doc.text('Type:', 115, 135);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_THEME.statusPaid);
    doc.text('Crédit (Avance)', 170, 135);
    doc.setTextColor(...PDF_THEME.textBody);
  }

  return 155;
};

const formatPaymentDate = (dateString: string | Date): string => {
  try {
    const date = dateString instanceof Date
      ? dateString
      : new Date(dateString);

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return String(dateString);
  }
};
