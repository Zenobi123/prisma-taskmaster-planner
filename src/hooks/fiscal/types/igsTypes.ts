
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

export interface IGSData {
  establishments: Establishment[];
  previousYearRevenue: number;
  igsClass: number;
  igsAmount: number;
  cgaReduction: boolean;
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

export const createDefaultIGSData = (): IGSData => ({
  establishments: [createDefaultEstablishment()],
  previousYearRevenue: 0,
  igsClass: 1,
  igsAmount: 20000,
  cgaReduction: false
});
