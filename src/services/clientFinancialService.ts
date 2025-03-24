
// This file is maintained for backward compatibility
// Import from the refactored structure
import { 
  getClientsFinancialSummary,
  getClientFinancialDetails,
  applyCreditToInvoice,
  createPaymentReminder
} from './clientFinancialService/index';

// Re-export everything for backward compatibility
export {
  getClientsFinancialSummary,
  getClientFinancialDetails,
  applyCreditToInvoice,
  createPaymentReminder
};
