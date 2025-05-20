
export type DeclarationPeriodicity = "annuelle" | "mensuelle";

export interface AttachmentType {
  declaration?: string;
  receipt?: string;
  payment?: string;
  additional?: string;
  attestation?: string;
}

export interface TaxObligationStatus {
  assujetti: boolean;
  paye: boolean;
  observations?: string;
  dateReglement?: string;
  montantAnnuel?: number;
  q1Paye?: boolean;
  q2Paye?: boolean;
  q3Paye?: boolean;
  q4Paye?: boolean;
  attachments?: Record<string, string>;
  payment_attachments?: Record<string, string>;
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
  periodicity: DeclarationPeriodicity;
  dateDepot?: string;
  observations?: string;
  attachments?: Record<string, string>;
  applicable?: boolean;
  submitted?: boolean;
  approved?: boolean;
}

export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus;

export interface ObligationStatuses {
  igs: TaxObligationStatus;
  patente: TaxObligationStatus;
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
  iba: TaxObligationStatus;
  baic: TaxObligationStatus;
  ibnc: TaxObligationStatus;
  ircm: TaxObligationStatus;
  irf: TaxObligationStatus;
  its: TaxObligationStatus;
  licence: DeclarationObligationStatus;
  precompte: TaxObligationStatus;
  taxeSejour: TaxObligationStatus;
  baillCommercial: TaxObligationStatus;
}

// Update the rest of the types to be consistent
export type TaxObligationType = keyof Omit<ObligationStatuses, 'dsf' | 'darp' | 'licence'>;
export type DeclarationObligationType = 'dsf' | 'darp' | 'licence';
export type ObligationType = TaxObligationType | DeclarationObligationType;

// Add the ClientFiscalData type which was missing
export interface ClientFiscalData {
  attestation?: {
    creationDate: string | null;
    validityEndDate: string | null;
    showInAlert?: boolean;
  };
  obligations?: Record<string, ObligationStatuses>;
  selectedYear?: string;
  hiddenFromDashboard?: boolean;
  updatedAt?: string;
}
