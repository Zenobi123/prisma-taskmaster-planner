
import { PayrollCalculator } from "@/components/gestion/tabs/paie/PayrollCalculator";

/**
 * Service exposant les méthodes de calcul de paie
 */
export const calculationService = {
  // Calculs pour l'employé
  calculateCNPSEmployee: (grossSalary: number) => PayrollCalculator.calculateCNPSEmployee(grossSalary),
  calculateIRPP: (grossSalary: number) => PayrollCalculator.calculateIRPP(grossSalary),
  calculateCAC: (irpp: number) => PayrollCalculator.calculateCAC(irpp),
  calculateTDL: (grossSalary: number) => PayrollCalculator.calculateTDL(grossSalary),
  calculateRAV: (grossSalary: number) => PayrollCalculator.calculateRAV(grossSalary),
  calculateCFCEmployee: (grossSalary: number) => PayrollCalculator.calculateCFCEmployee(grossSalary),
  calculateNetSalary: (grossSalary: number) => PayrollCalculator.calculateNetSalary(grossSalary),

  // Calculs pour l'employeur
  calculateCNPSEmployer: (grossSalary: number, risque: 'faible' | 'moyen' | 'eleve' = 'moyen') => 
    PayrollCalculator.calculateCNPSEmployer(grossSalary, risque),
  calculateFNE: (grossSalary: number) => PayrollCalculator.calculateFNE(grossSalary),
  calculateCFCEmployer: (grossSalary: number) => PayrollCalculator.calculateCFCEmployer(grossSalary),
  
  // Paramètres de calcul
  getEmployerRates: () => {
    return {
      cnpsRate: PayrollCalculator.CHARGES_SOCIALES.pensionVieillesseEmployeur + 
                PayrollCalculator.CHARGES_SOCIALES.prestationsFamiliales.general +
                PayrollCalculator.CHARGES_SOCIALES.accidentsTravail.risqueMoyen,
      fneRate: PayrollCalculator.CHARGES_SOCIALES.fne,
      cfcRate: PayrollCalculator.CHARGES_SOCIALES.cfcEmployeur
    };
  },
  
  getEmployeeRates: () => {
    return {
      cnpsRate: PayrollCalculator.CHARGES_SOCIALES.pensionVieillesseSalarie,
      cfcRate: PayrollCalculator.CHARGES_SOCIALES.cfcEmploye,
      cacRate: PayrollCalculator.CHARGES_FISCALES.tauxCAC,
      tdlTable: PayrollCalculator.CHARGES_FISCALES.baremesTDL,
      ravTable: PayrollCalculator.CHARGES_FISCALES.baremesRAV
    };
  }
};
