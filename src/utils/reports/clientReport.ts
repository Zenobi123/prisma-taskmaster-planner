
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Client } from '@/types/client';
import { exportToPdf } from '@/utils/exports';

export const generateClientReport = () => {
  const doc = new jsPDF();
  
  // Set document title
  doc.setFontSize(18);
  doc.text('Rapport Client', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Date du rapport: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Add content placeholder
  doc.setFontSize(12);
  doc.text('Contenu du rapport client', 14, 50);
  
  // Save the PDF
  doc.save('rapport-client.pdf');
};

export const generateClientDetailReport = (client: Client) => {
  const doc = new jsPDF();
  
  // Set document title
  doc.setFontSize(18);
  doc.text(`Rapport détaillé: ${client.nom || client.raisonsociale}`, 14, 22);
  
  // Add client info
  doc.setFontSize(12);
  doc.text('Informations client:', 14, 35);
  doc.setFontSize(10);
  doc.text(`ID: ${client.id}`, 20, 45);
  doc.text(`NIU: ${client.niu || 'Non spécifié'}`, 20, 52);
  doc.text(`Type: ${client.type}`, 20, 59);
  doc.text(`Centre de rattachement: ${client.centrerattachement || 'Non spécifié'}`, 20, 66);
  
  // Add contact info if available
  if (client.contact && client.contact.telephone) {
    doc.text(`Téléphone: ${client.contact.telephone}`, 20, 73);
  }
  
  // Add gestion status
  doc.text(`Gestion externalisée: ${client.gestionexternalisee ? 'Oui' : 'Non'}`, 20, 80);
  
  // Save the PDF
  doc.save(`rapport-client-${client.id}.pdf`);
};
