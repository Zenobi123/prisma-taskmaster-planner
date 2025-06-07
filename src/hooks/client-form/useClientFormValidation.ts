
import { RegimeFiscal } from "@/types/client";

// Valid regime fiscal values - enforced by database constraint
const VALID_REGIME_FISCAL: RegimeFiscal[] = ["reel", "igs", "non_professionnel"];

// Function to validate and clean regime fiscal value
export const validateRegimeFiscal = (value: any): RegimeFiscal => {
  console.log("Validating regimefiscal value:", value, "type:", typeof value);
  
  if (typeof value === "string" && VALID_REGIME_FISCAL.includes(value as RegimeFiscal)) {
    return value as RegimeFiscal;
  }
  
  console.warn(`Invalid regimefiscal value: ${value}, defaulting to 'reel'`);
  return "reel";
};
