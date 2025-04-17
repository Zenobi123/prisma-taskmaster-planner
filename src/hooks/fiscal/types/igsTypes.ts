
import { v4 as uuidv4 } from 'uuid';

export interface Establishment {
  id: string;
  name: string;
  activity: string;
  city: string;
  department: string;
  district: string;
  revenue: number;
}

export interface QuarterlyPayment {
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

export interface IGSData {
  establishments: Establishment[];
  previousYearRevenue: number;
  igsClass: number;
  igsAmount: number;
  cgaReduction: boolean;
  quarterlyPayments: QuarterlyPayment[];
}

export const createDefaultEstablishment = (): Establishment => ({
  id: uuidv4(),
  name: "Établissement principal",
  activity: "",
  city: "",
  department: "",
  district: "",
  revenue: 0
});

export const createDefaultQuarterlyPayments = (totalAmount: number = 20000): QuarterlyPayment[] => {
  const quarterlyAmount = totalAmount / 4;
  const currentYear = new Date().getFullYear();
  
  return [
    { dueDate: `15/01/${currentYear}`, amount: quarterlyAmount, isPaid: false },
    { dueDate: `15/04/${currentYear}`, amount: quarterlyAmount, isPaid: false },
    { dueDate: `15/07/${currentYear}`, amount: quarterlyAmount, isPaid: false },
    { dueDate: `15/10/${currentYear}`, amount: quarterlyAmount, isPaid: false },
  ];
};

export const createDefaultIGSData = (): IGSData => ({
  establishments: [createDefaultEstablishment()],
  previousYearRevenue: 0,
  igsClass: 1,
  igsAmount: 20000,
  cgaReduction: false,
  quarterlyPayments: createDefaultQuarterlyPayments()
});
