
export interface FiscalAlert {
  type: string;
  title: string;
  description: string;
  clientId?: string; // Add clientId for navigation
}

export interface FiscalObligation {
  name: string;
  deadline: string;
  daysRemaining: number;
  type: string;
  clientId?: string; // Add clientId for navigation
}

export interface ProcessedClient {
  id: string;
  name: string;
  fiscalData: any;
  type: 'physique' | 'morale';
  nom?: string;
  raisonsociale?: string;
}
