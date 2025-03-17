
export interface FiscalAlert {
  type: string;
  title: string;
  description: string;
}

export interface FiscalObligation {
  name: string;
  deadline: string;
  daysRemaining: number;
  type: string;
}

export interface ProcessedClient {
  id: string;
  name: string;
  fiscalData: any;
  type: 'physique' | 'morale';
  nom?: string;
  raisonsociale?: string;
}
