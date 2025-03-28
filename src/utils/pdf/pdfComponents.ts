
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Client } from '@/types/client';

// Function to format date from any string format to "dd/MM/yyyy"
export const formatDateForDisplay = (dateString: string): string => {
  try {
    // Parse the date string to create a Date object
    const date = new Date(dateString);
    // Format the date to "dd/MM/yyyy"
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return the original string if parsing fails
  }
};

// Add a company logo to the PDF
export const addCompanyLogo = (doc: jsPDF) => {
  // You can add a base64 encoded logo here
  // For now we'll just add text for the company name with styling
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('PRISMA GESTION', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Gestion comptable et fiscale', 15, 25);
  doc.text('Yaoundé, Cameroun', 15, 30);
  doc.text('Tel: +237 123 456 789', 15, 35);
  doc.text('Email: contact@prismagestion.com', 15, 40);
};

// Add the invoice info box on the right side
export const addInvoiceInfoBox = (doc: jsPDF, title: string, reference: string, date: string) => {
  // Draw info box with light green background
  doc.setFillColor(240, 248, 240); // Light green background
  doc.roundedRect(120, 15, 75, 30, 3, 3, 'F');
  
  // Add title and details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text(title, 130, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`N° ${reference}`, 130, 32);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDateForDisplay(date)}`, 130, 38);
};

// Add client information section
export const addClientSection = (doc: jsPDF, client: Client) => {
  // Create a box for client info
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, 50, 180, 35, 3, 3, 'F');
  
  // Add client header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('CLIENT', 20, 60);
  
  // Add client details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Display client name - using company name or personal name as appropriate
  doc.setFont('helvetica', 'bold');
  doc.text(`${client.nom}`, 20, 67);
  doc.setFont('helvetica', 'normal');
  
  // Additional client fields if available from the Client type
  const additionalInfo: string[] = [];
  
  // Add any client-specific fields that may be available (handling safely)
  if ('niu' in client && client.niu) {
    additionalInfo.push(`NIU: ${client.niu}`);
  }
  
  if ('adresse' in client) {
    const clientAddress = typeof client.adresse === 'object' 
      ? `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}`
      : client.adresse;
    doc.text(`${clientAddress}`, 20, 80);
  }
  
  if (additionalInfo.length > 0) {
    doc.text(additionalInfo.join(' | '), 20, 74);
  }
  
  // Contact info
  if ('contact' in client && client.contact) {
    let contactInfo = '';
    if (client.contact.telephone) contactInfo += `Tél: ${client.contact.telephone}`;
    if (client.contact.telephone && client.contact.email) contactInfo += ' | ';
    if (client.contact.email) contactInfo += `Email: ${client.contact.email}`;
    doc.text(contactInfo, 120, 74);
  }
};
