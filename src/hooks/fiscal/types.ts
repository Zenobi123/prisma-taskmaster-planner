
// Types for fiscal management

export interface IgsPaymentStatus {
  paid: boolean;
  date?: string;
  amount?: number;
  receipt?: string;
}

export interface TaxObligationStatus {
  status: 'paid' | 'pending' | 'unpaid';
  isAssujetti: boolean;
  lastFiled?: string;
  nextDue?: string;
  montant?: number;
  notes?: string;
  paiementsTrimestriels?: { 
    [key: string]: IgsPaymentStatus;
  };
}

export interface FiscalObligations {
  [key: string]: TaxObligationStatus;
}

export interface AttestationData {
  creationDate?: string;
  validityEndDate?: string;
  showInAlert?: boolean;
}

export interface ClientFiscalData {
  attestation?: AttestationData;
  obligations?: FiscalObligations;
  hiddenFromDashboard?: boolean;
}

export interface FiscalClientResponse {
  clientId: string;
  fiscalData: ClientFiscalData;
}
