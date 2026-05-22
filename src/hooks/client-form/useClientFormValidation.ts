
import { RegimeFiscal } from "@/types/client";

// Valid regime fiscal values - enforced by database constraint
const VALID_REGIME_FISCAL: RegimeFiscal[] = ["reel", "igs", "non_professionnel", "obnl"];

// Function to validate and clean regime fiscal value
export const validateRegimeFiscal = (value): RegimeFiscal => {
  
  if (typeof value === "string" && VALID_REGIME_FISCAL.includes(value as RegimeFiscal)) {
    return value as RegimeFiscal;
  }
  
  return "reel";
};
