
// This file is maintained for backward compatibility
// Import the refactored hook from the new location
import { useFactureForm } from './facturation/factureForm';

// Re-export everything
export { useFactureForm };
export type { UseFactureFormReturn } from './facturation/factureForm';
export default useFactureForm;
