
import jsPDF from 'jspdf';
import { PDFFacture } from '../types';
import { addCompanyLogo, addInvoiceInfoBox, addClientSection } from '../pdfComponents';

export const addInvoiceHeader = (doc: jsPDF, facture: PDFFacture) => {
  // Add company logo/header with improved quality
  addCompanyLogo(doc);
  
  // Add invoice info box with better contrast
  addInvoiceInfoBox(doc, 'FACTURE', facture.id, facture.date);
  
  // Add client information section with better formatting
  addClientSection(doc, facture.client);
  
  // Add payment details box with improved visual elements
  addPaymentDetailsBox(doc, facture);
};

// Add payment details box with status
const addPaymentDetailsBox = (doc: jsPDF, facture: PDFFacture) => {
  // Add invoice details with better typography
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  
  // Add payment details box with improved design
  doc.setFillColor(240, 250, 240); // Slightly improved light green background
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
  
  // Enhanced typography and positioning for payment details
  doc.text(`Échéance: ${formatDateForDisplay(facture.echeance)}`, 130, 100);
  doc.text(`Montant total: ${facture.montant.toLocaleString('fr-FR')} XAF`, 130, 107);
  
  // Display payment status with enhanced colors
  let statusText = "";
  let statusColor: [number, number, number] = [0, 0, 0]; // Default: black
  
  // Determine status based on status_paiement if available, otherwise fall back to legacy behavior
  const paymentStatus = facture.status_paiement || facture.status;
  
  if (paymentStatus === 'payée' || paymentStatus === 'payee') {
    statusText = "PAYÉE";
    statusColor = [0, 128, 0]; // Rich Green
  } else if (paymentStatus === 'partiellement_payée' || paymentStatus === 'partiellement_payee') {
    statusText = "PARTIELLEMENT PAYÉE";
    statusColor = [230, 126, 0]; // Enhanced Orange
  } else if (paymentStatus === 'en_retard') {
    statusText = "EN RETARD";
    statusColor = [200, 0, 0]; // Deeper Red
  } else {
    statusText = "EN ATTENTE";
    statusColor = [50, 100, 170]; // Enhanced Steel Blue
  }
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${statusText}`, 130, 115);
  doc.setTextColor(0, 0, 0); // Reset text color
  
  // Add horizontal separator line with enhanced styling
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.5);
  doc.line(15, 130, 195, 130);
};
