
export interface FiscalDocument {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  validUntil: Date | null;
}

export interface FiscalProcedure {
  id: string;
  name: string;
  description: string;
}

export interface FiscalContact {
  id: string;
  name: string;
  description: string;
  phone: string;
}
