
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Client } from '@/types/client';
import { PDF_THEME } from './pdfTheme';

// Function to format date from any string format to "dd/MM/yyyy"
export const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Add a company logo to the PDF
export const addCompanyLogo = (doc: jsPDF) => {
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textHeading);
  doc.text('PRISMA GESTION', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PDF_THEME.textSecondary);
  doc.text('Gestion comptable et fiscale', 15, 25);
  doc.text('Yaoundé, Cameroun', 15, 30);
  doc.text('Tel: +237 123 456 789', 15, 35);
  doc.text('Email: contact@prismagestion.com', 15, 40);
};

// Add the invoice info box on the right side
export const addInvoiceInfoBox = (doc: jsPDF, title: string, reference: string, date: string) => {
  doc.setFillColor(...PDF_THEME.bgPrimary);
  doc.roundedRect(120, 15, 75, 30, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textHeading);
  doc.text(title, 130, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`N° ${reference}`, 130, 32);

  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDateForDisplay(date)}`, 130, 38);
};

// Add client information section
export const addClientSection = (doc: jsPDF, client: Client) => {
  doc.setFillColor(...PDF_THEME.bgLight);
  doc.roundedRect(15, 50, 180, 35, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_THEME.textHeading);
  doc.text('CLIENT', 20, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.setFont('helvetica', 'bold');
  const clientName = client.type === 'morale' && client.raisonsociale ? client.raisonsociale : client.nom;
  doc.text(clientName || '', 20, 67);
  doc.setFont('helvetica', 'normal');

  const additionalInfo: string[] = [];
  if ('niu' in client && client.niu) {
    additionalInfo.push(`NIU: ${client.niu}`);
  }

  if (additionalInfo.length > 0) {
    doc.text(additionalInfo.join(' | '), 20, 74);
  }

  if ('adresse' in client && client.adresse) {
    const clientAddress = typeof client.adresse === 'object'
      ? `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}`
      : client.adresse;
    doc.text(`${clientAddress}`, 20, 80);
  }

  if ('contact' in client && client.contact) {
    let contactInfo = '';
    if (client.contact.telephone) contactInfo += `Tél: ${client.contact.telephone}`;
    if (client.contact.telephone && client.contact.email) contactInfo += ' | ';
    if (client.contact.email) contactInfo += `Email: ${client.contact.email}`;
    doc.text(contactInfo, 120, 74);
  }
};
