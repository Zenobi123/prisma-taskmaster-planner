export type ObligationType = "tax" | "declaration";
export type DeclarationPeriodicity = "monthly" | "annual";

export interface IgsPaymentStatus {
  isPaid: boolean;
  datePayment?: string;
}

export interface TaxObligationStatus extends ObligationStatus {
  assujetti: boolean;
  paye: boolean;
  observations?: string;
  attachments?: {
    attestation?: string;
    receipt?: string;
    [key: string]: string | undefined;
  };
  montantAnnuel?: number;
  q1Paye?: boolean;
  q2Paye?: boolean;
  q3Paye?: boolean;
  q4Paye?: boolean;
  [key: string]: any;
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
  dateDepot?: string;
  observations?: string;
  periodicity: DeclarationPeriodicity; // Required property
  // Attachment fields for declarations
  attachments?: {
    declaration?: string;
    receipt?: string;
    payment?: string;
    additional?: string;
  };
}

export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus;

export interface ObligationStatuses {
  [key: string]: ObligationStatus;
  igs: TaxObligationStatus;
  patente: TaxObligationStatus;
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
  iba: TaxObligationStatus; // Impôts sur les Bénéfices Agricoles
  baic: TaxObligationStatus; // Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux
  ibnc: TaxObligationStatus; // Impôts sur les Bénéfices des Professions Non Commerciales
  ircm: TaxObligationStatus; // Impôts sur les Revenus des Capitaux Mobiliers
  irf: TaxObligationStatus; // Impôts sur les Revenus Foncier
  its: TaxObligationStatus; // Impôts sur les traitements, salaires et rentes viagères
  licence: DeclarationObligationStatus; // Licence
  precompte: TaxObligationStatus; // Précompte sur loyer
  taxeSejour: TaxObligationStatus; // Taxe de séjour dans les établissements d'hébergement
  baillCommercial: TaxObligationStatus; // Bail Commercial obligation
}

export interface ClientFiscalData {
  attestation?: {
    creationDate: string | null;
    validityEndDate: string | null;
    showInAlert: boolean;
  };
  obligations?: {
    [year: string]: ObligationStatuses;
  };
  hiddenFromDashboard?: boolean;
  updatedAt?: string;
  selectedYear?: string;
}

export interface FiscalData {
  attestation?: {
    creationDate: string | null;
    validityEndDate: string | null;
    showInAlert: boolean;
  };
  obligations?: {
    [year: string]: ObligationStatuses;
  };
  hiddenFromDashboard?: boolean;
  updatedAt?: string;
  selectedYear?: string;
}
