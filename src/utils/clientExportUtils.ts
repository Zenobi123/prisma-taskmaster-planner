
// This file is now just a re-export of the new modular export utilities
import { formatClientForExport, extractFiscalData } from './export/clientDataFormatter';
import { exportClientsToPDF } from './export/pdfExport';
import { exportClientsToExcel } from './export/csvExport';
import { formatMontant } from "./formatUtils";

export {
  exportClientsToPDF,
  exportClientsToExcel,
  formatClientForExport,
  extractFiscalData
};
