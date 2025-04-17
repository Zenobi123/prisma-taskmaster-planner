
import { CGAClasse } from "@/types/client";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { igsClassesInfo } from "../IGSClassSelector";

/**
 * Calculate IGS amount based on class and CGA status
 */
export const calculateIGSAmount = (soumisIGS: boolean, classeIGS?: CGAClasse, adherentCGA?: boolean): number | null => {
  if (!soumisIGS || !classeIGS || !igsClassesInfo[classeIGS]) {
    return null;
  }
  
  let montantIGS = igsClassesInfo[classeIGS].montant;
  
  // Apply 50% reduction for CGA members
  if (adherentCGA) {
    montantIGS = montantIGS * 0.5;
  }
  
  return montantIGS;
};

/**
 * Calculate IGS reliquat after deductions
 */
export const calculateIGSReliquat = (
  montantIGS: number | null,
  patente: IGSPayment,
  acompteJanvier: IGSPayment,
  acompteFevrier: IGSPayment
): number | null => {
  if (montantIGS === null) {
    return null;
  }
  
  const patenteValue = parseFloat(patente.montant) || 0;
  const janvierValue = parseFloat(acompteJanvier.montant) || 0;
  const fevrierValue = parseFloat(acompteFevrier.montant) || 0;
  
  const reliquatValue = montantIGS - patenteValue - janvierValue - fevrierValue;
  return reliquatValue > 0 ? reliquatValue : 0;
};

/**
 * Determine IGS class based on annual turnover
 */
export const determineIGSClassFromCA = (chiffreAffaires: number): CGAClasse => {
  if (chiffreAffaires < 500000) return "classe1";
  if (chiffreAffaires < 1000000) return "classe2";
  if (chiffreAffaires < 1500000) return "classe3";
  if (chiffreAffaires < 2000000) return "classe4";
  if (chiffreAffaires < 2500000) return "classe5";
  if (chiffreAffaires < 5000000) return "classe6";
  if (chiffreAffaires < 10000000) return "classe7";
  if (chiffreAffaires < 20000000) return "classe8";
  if (chiffreAffaires < 30000000) return "classe9";
  return "classe10";
};
