
/**
 * Types liés à la gestion de la paie
 */

export interface PayrollItem {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  grossSalary: number;
  cnpsEmployee: number;
  irpp: number;
  netSalary: number;
  bonuses?: number;
  overtimeHours?: number;
  overtimeAmount?: number;
}

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  birthdate?: string;
  gender?: 'M' | 'F';
  idNumber?: string;
  phone?: string;
  address?: string;
  email?: string;
  position: string;
  department?: string;
  hireDate: string;
  contractType?: 'CDI' | 'CDD' | 'Stage';
  baseSalary: number;
  cnpsNumber?: string;
  bankName?: string;
  bankAccount?: string;
}

export interface Payroll {
  month: number;
  year: number;
  items: PayrollItem[];
}

export interface CompanySettings {
  name: string;
  address: string;
  nif: string;
  cnps: string;
  cnpsRateEmployee: number;
  cnpsRateEmployer: number;
  taxAbatement: number;
}
