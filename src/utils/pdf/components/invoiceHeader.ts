
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { addCompanyLogo, addInvoiceInfoBox, addClientSection } from '../pdfComponents';

export const addInvoiceHeader = (doc: jsPDF, facture: PDFFacture) => {
  // Add company logo/header
  addCompanyLogo(doc);
  
  // Add invoice info box
  addInvoiceInfoBox(doc, 'FACTURE', facture.id, facture.date);
  
  // Add client information section
  addClientSection(doc, facture.client);
  
  // Add payment details box
  addPaymentDetailsBox(doc, facture);
};

// Add payment details box with status
const addPaymentDetailsBox = (doc: jsPDF, facture: PDFFacture) => {
  // Add invoice details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Add payment details box
  doc.setFillColor(240, 248, 240); // Light green background
  doc.roundedRect(120, 90, 75, 30, 3, 3, 'F');
  
  const formatDateForDisplay = (dateString: string): string => {
    try {
      // Parse the date string to create a Date object
      const date = new Date(dateString);
      // Format the date to "dd/MM/yyyy"
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if parsing fails
    }
  };
  
  doc.text(`Échéance: ${formatDateForDisplay(facture.echeance)}`, 130, 100);
  doc.text(`Montant total: ${facture.montant.toLocaleString('fr-FR')} XAF`, 130, 107);
  
  // Display payment status
  let statusText = "";
  let statusColor: [number, number, number] = [0, 0, 0]; // Default: black
  
  // Determine status based on status_paiement if available, otherwise fall back to legacy behavior
  const paymentStatus = facture.status_paiement || facture.status;
  
  if (paymentStatus === 'payée' || paymentStatus === 'payee') {
    statusText = "PAYÉE";
    statusColor = [0, 128, 0]; // Green
  } else if (paymentStatus === 'partiellement_payée' || paymentStatus === 'partiellement_payee') {
    statusText = "PARTIELLEMENT PAYÉE";
    statusColor = [255, 140, 0]; // Orange
  } else if (paymentStatus === 'en_retard') {
    statusText = "EN RETARD";
    statusColor = [220, 20, 60]; // Crimson
  } else {
    statusText = "EN ATTENTE";
    statusColor = [70, 130, 180]; // Steel Blue
  }
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${statusText}`, 130, 115);
  doc.setTextColor(0, 0, 0); // Reset text color
  
  // Add horizontal separator line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, 130, 195, 130);
};
