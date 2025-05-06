
import { Employee, PayrollItem } from "./types";

export class PayrollCalculator {
  // Taux de cotisation par défaut
  private cnpsEmployeeRate: number = 4.2; // 4.2%
  private cnpsEmployerRate: number = 12.95; // 12.95%
  private taxAbatement: number = 30; // 30%

  constructor(
    cnpsEmployeeRate?: number,
    cnpsEmployerRate?: number,
    taxAbatement?: number
  ) {
    if (cnpsEmployeeRate !== undefined) this.cnpsEmployeeRate = cnpsEmployeeRate;
    if (cnpsEmployerRate !== undefined) this.cnpsEmployerRate = cnpsEmployerRate;
    if (taxAbatement !== undefined) this.taxAbatement = taxAbatement;
  }

  public calculatePayroll(employee: Employee, month: number, year: number): PayrollItem {
    // Calcul du salaire brut
    const grossSalary = employee.baseSalary;
    
    // Calcul des cotisations CNPS (plafonnées à 750,000 FCFA)
    const cnpsCap = 750000;
    const salaryForCNPS = Math.min(grossSalary, cnpsCap);
    const cnpsEmployee = Math.round(salaryForCNPS * (this.cnpsEmployeeRate / 100));
    
    // Calcul du salaire imposable après abattement
    const taxableIncome = grossSalary - cnpsEmployee;
    const afterAbatement = taxableIncome * (1 - this.taxAbatement / 100);
    
    // Calcul simplifié de l'IRPP (à affiner selon les tranches du barème fiscal camerounais)
    // Ce calcul est très simplifié et devrait être adapté selon la législation fiscale
    let irpp = 0;
    
    if (afterAbatement <= 62000) {
      irpp = 0;
    } else if (afterAbatement <= 310000) {
      irpp = Math.round(afterAbatement * 0.1);
    } else if (afterAbatement <= 429167) {
      irpp = Math.round(afterAbatement * 0.15);
    } else if (afterAbatement <= 667000) {
      irpp = Math.round(afterAbatement * 0.25);
    } else {
      irpp = Math.round(afterAbatement * 0.35);
    }
    
    // Calcul du salaire net
    const netSalary = grossSalary - cnpsEmployee - irpp;
    
    // Créer et retourner l'objet de paie
    return {
      id: this.generateId(),
      employeeId: employee.id,
      month,
      year,
      grossSalary,
      cnpsEmployee,
      irpp,
      netSalary
    };
  }
  
  private generateId(): number {
    return Date.now();
  }
}
