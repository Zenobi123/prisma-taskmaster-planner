
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Client } from '@/types/facture';

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
  
  // Company or person name based on client type
  if (client.type === 'morale' && client.raisonsociale) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${client.raisonsociale}`, 20, 67);
    doc.setFont('helvetica', 'normal');
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text(`${client.nom}`, 20, 67);
    doc.setFont('helvetica', 'normal');
  }
  
  // NIU if available
  if (client.niu) {
    doc.text(`NIU: ${client.niu}`, 20, 74);
  }
  
  // Address and contact info
  if (client.adresse) {
    doc.text(`${client.adresse}`, 20, 80);
  }
  
  if (client.telephone || client.email) {
    let contactInfo = '';
    if (client.telephone) contactInfo += `Tél: ${client.telephone}`;
    if (client.telephone && client.email) contactInfo += ' | ';
    if (client.email) contactInfo += `Email: ${client.email}`;
    doc.text(contactInfo, 120, 74);
  }
};
