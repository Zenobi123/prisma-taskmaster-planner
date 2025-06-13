
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
  // Montants trimestriels
  q1Montant?: number;
  q2Montant?: number;
  q3Montant?: number;
  q4Montant?: number;
  // Dates trimestrielles
  q1Date?: string;
  q2Date?: string;
  q3Date?: string;
  q4Date?: string;
  // Références trimestrielles
  q1Reference?: string;
  q2Reference?: string;
  q3Reference?: string;
  q4Reference?: string;
  // Modes de paiement trimestriels
  q1Mode?: string;
  q2Mode?: string;
  q3Mode?: string;
  q4Mode?: string;
  // Calculs
  montantTotalPaye?: number;
  soldeRestant?: number;
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
}

export type DeclarationPeriodicity = "mensuelle" | "trimestrielle" | "annuelle";

// Define obligation types - updated to include DBEF
export type ObligationType = "igs" | "patente" | "licence" | "bailCommercial" | "precompteLoyer" | "tpf" | "dsf" | "darp" | "dbef" | "cntps" | "precomptes";

// Define all obligation statuses with proper typing for each specific obligation
export interface ObligationStatuses {
  // Direct taxes (impôts directs) - All obligations used in DirectTaxesSection
  igs: IgsObligationStatus;
  patente: TaxObligationStatus;
  licence: TaxObligationStatus;
  bailCommercial: TaxObligationStatus;
  precompteLoyer: TaxObligationStatus;
  tpf: TaxObligationStatus;
  // Declarations
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
  dbef: DeclarationObligationStatus;
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
