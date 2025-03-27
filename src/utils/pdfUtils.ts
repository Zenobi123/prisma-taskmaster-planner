
// Export from the refactored files for backward compatibility
import { generateInvoicePDF } from './pdf/invoicePdfGenerator';
import { generateReceiptPDF, formatClientForReceipt } from './pdf/receiptPdfGenerator';

// Re-export to ensure backward compatibility
export { generateInvoicePDF as generatePDF, generateReceiptPDF, formatClientForReceipt };
