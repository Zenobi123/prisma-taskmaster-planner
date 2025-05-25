
// Define the base obligation status
export interface ObligationStatus {
  assujetti: boolean;
  attachements?: Record<string, string>;
  observations?: string;
}

// Define tax obligation status (for direct taxes)
export interface TaxObligationStatus extends ObligationStatus {
  payee: boolean;
  dateEcheance?: string;
  datePaiement?: string;
  montant?: number;
  montantAnnuel?: number;
  montantPenalite?: number;
  montantTotal?: number;
  methodePaiement?: string;
  referencePaiement?: string;
  q1Payee?: boolean;
  q2Payee?: boolean;
  q3Payee?: boolean;
  q4Payee?: boolean;
}

// Define IGS obligation status with quarterly payments
export interface IgsObligationStatus extends TaxObligationStatus {
  montantAnnuel?: number;
  caValue?: string;
  isCGA?: boolean;
  classe?: string | number;
  outOfRange?: boolean;
}

// Define declaration obligation status
export interface DeclarationObligationStatus extends ObligationStatus {
  depose: boolean;
  periodicity: DeclarationPeriodicity;
  dateDepot?: string;
  dateEcheance?: string;
  regime?: string;
  dateSoumission?: string;
  dateLimite?: string;
}

export type DeclarationPeriodicity = "mensuelle" | "trimestrielle" | "annuelle";

// Define obligation types - updated to match frontend usage
export type ObligationType = "igs" | "patente" | "licence" | "bailCommercial" | "precompteLoyer" | "tpf" | "dsf" | "darp" | "cntps" | "precomptes";

// Define all tax obligation statuses - updated to match DirectTaxesSection
export interface ObligationStatuses {
  // Direct taxes (impôts directs)
  igs: IgsObligationStatus;
  patente: TaxObligationStatus;
  licence: TaxObligationStatus;
  bailCommercial: TaxObligationStatus;
  precompteLoyer: TaxObligationStatus;
  tpf: TaxObligationStatus;
  // Declarations
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
  cntps: DeclarationObligationStatus;
  precomptes: DeclarationObligationStatus;
}

// Define fiscal data
export interface ClientFiscalData {
  clientId: string;
  year?: string;
  attestation?: {
    creationDate: string;
    validityEndDate: string;
    showInAlert: boolean;
  };
  obligations?: Record<string, ObligationStatuses>;
  hiddenFromDashboard?: boolean;
  selectedYear?: string;
  updatedAt?: string;
}
