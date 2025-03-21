
// This file is maintained for backward compatibility
// Import the refactored hook from the new location
import { useFactures } from './facturation/useFactures';

// Re-export everything
export { useFactures };
export default useFactures;
