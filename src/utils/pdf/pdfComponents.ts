
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

// Add a company logo to the PDF with enhanced styling
export const addCompanyLogo = (doc: jsPDF) => {
  // Create a header background for better visual definition
  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, doc.internal.pageSize.width, 45, 'F');
  
  // Add subtle header bottom border
  doc.setDrawColor(230, 240, 230);
  doc.setLineWidth(0.3);
  doc.line(10, 45, doc.internal.pageSize.width - 10, 45);
  
  // Company name with enhanced typography
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green color for brand identity
  doc.text('PRISMA GESTION', 15, 20);
  
  // Company details with improved formatting and spacing
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Gestion comptable et fiscale', 15, 27);
  doc.text('Yaoundé, Cameroun', 15, 32);
  doc.text('Tel: +237 123 456 789', 15, 37);
  doc.text('Email: contact@prismagestion.com', 15, 42);
};

// Add the invoice info box on the right side with enhanced styling
export const addInvoiceInfoBox = (doc: jsPDF, title: string, reference: string, date: string) => {
  // Draw info box with enhanced green background
  doc.setFillColor(240, 250, 240); // Light green background
  doc.roundedRect(120, 15, 75, 30, 3, 3, 'F');
  
  // Add border for better definition
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.2);
  doc.roundedRect(120, 15, 75, 30, 3, 3, 'S');
  
  // Add title and details with improved typography
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green
  doc.text(title, 130, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`N° ${reference}`, 130, 33);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDateForDisplay(date)}`, 130, 39);
};

// Add client information section with enhanced styling
export const addClientSection = (doc: jsPDF, client: Client) => {
  // Create a box for client info with better visual design
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(15, 50, 180, 35, 3, 3, 'F');
  
  // Add border for better definition
  doc.setDrawColor(230, 240, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, 50, 180, 35, 3, 3, 'S');
  
  // Add client header with improved styling
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green for consistency
  doc.text('CLIENT', 20, 60);
  
  // Add client details with better typography and spacing
  doc.setFontSize(11);
  
  // Display client name with better emphasis
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text(`${client.nom}`, 20, 68);
  doc.setFont('helvetica', 'normal');
  
  // Additional client fields with improved formatting
  const additionalInfo: string[] = [];
  
  // Add any client-specific fields with better handling
  if ('niu' in client && client.niu) {
    additionalInfo.push(`NIU: ${client.niu}`);
  }
  
  if (additionalInfo.length > 0) {
    doc.setFontSize(9);
    doc.text(additionalInfo.join(' | '), 20, 75);
  }
  
  // Address information with better positioning
  if ('adresse' in client) {
    const clientAddress = typeof client.adresse === 'object' 
      ? `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}`
      : client.adresse;
    
    doc.setFontSize(9);
    doc.text(`${clientAddress}`, 20, 81);
  }
  
  // Contact info with better formatting and icons
  if ('contact' in client && client.contact) {
    let contactInfo = '';
    
    if (client.contact.telephone) contactInfo += `Tél: ${client.contact.telephone}`;
    if (client.contact.telephone && client.contact.email) contactInfo += ' | ';
    if (client.contact.email) contactInfo += `Email: ${client.contact.email}`;
    
    doc.setFontSize(9);
    doc.text(contactInfo, 120, 75);
  }
};
