
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Paiement } from '@/types/paiement';
import { SimplifiedClient } from './types';
import { addReceiptHeader } from './components/receiptHeader';
import { addReceiptPaymentDetails } from './components/receiptPaymentDetails';
import { addReceiptAmountSection } from './components/receiptAmountSection';
import { addReceiptNotes } from './components/receiptNotes';
import { addReceiptFooter } from './components/receiptFooter';

// Function to generate a payment receipt PDF
export const generateReceiptPDF = (paiement: any, download?: boolean) => {
  try {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Reçu de paiement ${paiement.reference || paiement.id}`,
      subject: 'Reçu de paiement',
      author: 'PRISMA GESTION',
      keywords: 'reçu, paiement, pdf'
    });
    
    // Add receipt header (company logo + receipt info)
    addReceiptHeader(doc, paiement);
    
    // Add payment details section
    const paymentDetailsY = addReceiptPaymentDetails(doc, paiement);
    
    // Add amount section with green background
    const amountSectionY = addReceiptAmountSection(doc, paiement, paymentDetailsY);
    
    // Add notes if available
    const notesY = addReceiptNotes(doc, paiement, amountSectionY);
    
    // Add footer with watermark
    addReceiptFooter(doc, paiement.reference || paiement.id);
    
    if (download) {
      // Download the PDF
      doc.save(`Recu_${paiement.reference || paiement.id}.pdf`);
      return doc.output('blob');
    } else {
      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la génération du reçu PDF:", error);
    throw error;
  }
};

// Function to format client information for the receipt
export const formatClientForReceipt = (client: any): SimplifiedClient => {
  // If the client is already in the correct format, return it
  if (typeof client === 'object' && client.nom) {
    return createSimplifiedClient(client);
  }
  
  // If the client is just a string (name/ID), create a minimal client object
  if (typeof client === 'string') {
    return {
      id: '',
      nom: client,
      adresse: '',
      telephone: '',
      email: ''
    };
  }
  
  // Default empty client
  return {
    id: '',
    nom: 'Client',
    adresse: '',
    telephone: '',
    email: ''
  };
};

// Helper function to create a simplified client from a complex client object
const createSimplifiedClient = (client: any): SimplifiedClient => {
  return {
    id: client.id || '',
    nom: client.nom || client.raisonsociale || 'Client',
    adresse: typeof client.adresse === 'object' && client.adresse
      ? `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}`
      : (client.adresse || ''),
    telephone: typeof client.contact === 'object' && client.contact
      ? client.contact.telephone || ''
      : (client.telephone || ''),
    email: typeof client.contact === 'object' && client.contact
      ? client.contact.email || ''
      : (client.email || '')
  };
};
