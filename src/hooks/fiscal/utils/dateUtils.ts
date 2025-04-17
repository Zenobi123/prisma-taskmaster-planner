
import { parse, isValid, format, addMonths, differenceInDays } from "date-fns";
import { toast } from "sonner";

/**
 * Calculate end date based on creation date (3 months later)
 */
export const calculateValidityEndDate = (creationDate: string): string => {
  if (!creationDate) return "";
  
  try {
    // Date format is DD/MM/YYYY
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (datePattern.test(creationDate)) {
      const parsedDate = parse(creationDate, 'dd/MM/yyyy', new Date());
      
      if (isValid(parsedDate)) {
        // Calculate end date - 3 months after creation date
        const endDate = addMonths(parsedDate, 3);
        
        // Format the end date as DD/MM/YYYY
        return format(endDate, 'dd/MM/yyyy');
      } else {
        console.error("Invalid date format:", creationDate);
        return "";
      }
    } else if (creationDate.includes('-')) {
      // Support YYYY-MM-DD format (from HTML date inputs)
      const parsedDate = parse(creationDate, 'yyyy-MM-dd', new Date());
      
      if (isValid(parsedDate)) {
        // Calculate end date - 3 months after creation date
        const endDate = addMonths(parsedDate, 3);
        
        // Format the end date as DD/MM/YYYY
        return format(endDate, 'dd/MM/yyyy');
      } else {
        console.error("Invalid date format:", creationDate);
        return "";
      }
    }
    return "";
  } catch (error) {
    console.error("Error calculating validity end date:", error);
    return "";
  }
};

/**
 * Check attestation expiration and show toast notifications
 */
export const checkAttestationExpiration = (creationDate: string, validityEndDate: string): void => {
  if (!validityEndDate) return;
  
  try {
    const parsedDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
    
    if (isValid(parsedDate)) {
      const today = new Date();
      const daysUntilExpiration = differenceInDays(parsedDate, today);
      
      if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
        toast.warning(`L'Attestation de Conformité Fiscale expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`);
      } else if (daysUntilExpiration < 0) {
        toast.error(`L'Attestation de Conformité Fiscale est expirée depuis ${Math.abs(daysUntilExpiration)} jour${Math.abs(daysUntilExpiration) > 1 ? 's' : ''}.`);
      }
    }
  } catch (error) {
    console.error("Error checking attestation expiration:", error);
  }
};

/**
 * Convert date from French format (DD/MM/YYYY) to HTML format (YYYY-MM-DD)
 */
export const toHtmlDateFormat = (frenchDate: string): string => {
  if (!frenchDate) return "";
  const parts = frenchDate.split('/');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
};

/**
 * Convert date from HTML format (YYYY-MM-DD) to French format (DD/MM/YYYY)
 */
export const toFrenchDateFormat = (htmlDate: string): string => {
  if (!htmlDate) return "";
  const date = new Date(htmlDate);
  return isNaN(date.getTime()) ? "" : format(date, 'dd/MM/yyyy');
};
