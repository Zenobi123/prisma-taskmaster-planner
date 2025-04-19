
// Service centralisé d'exportation PDF pour rétrocompatibilité
import { generateInvoicePDF } from './pdf/invoicePdfGenerator';
import { generateReceiptPDF, formatClientForReceipt } from './pdf/receiptPdfGenerator';
import { DocumentService } from './pdf/services/DocumentService';

// Re-exporter les fonctions pour garantir la rétrocompatibilité
export { 
  generateInvoicePDF as generatePDF, 
  generateReceiptPDF, 
  formatClientForReceipt,
  DocumentService 
};

// Exporter toutes les fonctionnalités du service de document
export * from './pdf/services/DocumentService';
