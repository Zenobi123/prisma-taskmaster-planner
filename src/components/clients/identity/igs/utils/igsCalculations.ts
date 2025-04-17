
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
  patente: IGSPayment = { montant: '', quittance: '' },
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

/**
 * Get IGS payment deadlines for the current year
 */
export const getIGSPaymentDeadlines = () => {
  const currentYear = new Date().getFullYear();
  return [
    { id: 'trimestre1', label: `1er trimestre (15 janvier ${currentYear})`, date: new Date(currentYear, 0, 15) },
    { id: 'trimestre2', label: `2ème trimestre (15 avril ${currentYear})`, date: new Date(currentYear, 3, 15) },
    { id: 'trimestre3', label: `3ème trimestre (15 juillet ${currentYear})`, date: new Date(currentYear, 6, 15) },
    { id: 'trimestre4', label: `4ème trimestre (15 octobre ${currentYear})`, date: new Date(currentYear, 9, 15) },
  ];
};

/**
 * Calculate payment status based on completed payments
 */
export const calculatePaymentStatus = (
  completedPayments: string[],
  currentDate: Date = new Date()
): { isUpToDate: boolean; message: string } => {
  if (!Array.isArray(completedPayments)) {
    console.error("completedPayments n'est pas un tableau:", completedPayments);
    return { isUpToDate: false, message: "Erreur de données" };
  }
  
  const deadlines = getIGSPaymentDeadlines();
  const currentQuarter = Math.floor(currentDate.getMonth() / 3);
  
  // Pour le débogage
  console.log(`Date actuelle: ${currentDate}, Trimestre actuel: ${currentQuarter + 1}`);
  console.log(`Paiements effectués:`, completedPayments);
  
  // Calculate how many quarters should be paid by now
  const expectedPayments = deadlines
    .filter(deadline => deadline.date <= currentDate)
    .map(deadline => deadline.id);
  
  console.log(`Paiements attendus:`, expectedPayments);
  
  // Check if all expected payments have been completed
  const isUpToDate = expectedPayments.every(id => completedPayments.includes(id));
  
  if (isUpToDate) {
    return { 
      isUpToDate: true, 
      message: "Paiements à jour" 
    };
  } else {
    const missingPayments = expectedPayments
      .filter(id => !completedPayments.includes(id))
      .map(id => deadlines.find(d => d.id === id)?.label)
      .filter(Boolean) // Remove undefined values
      .join(", ");
      
    return { 
      isUpToDate: false, 
      message: `En retard pour: ${missingPayments}` 
    };
  }
};

/**
 * Calculate the quarterly payment amount
 */
export const calculateQuarterlyPayment = (totalAmount: number | null): number | null => {
  if (totalAmount === null) return null;
  return Math.ceil(totalAmount / 4);
};
