export type ObligationType = "igs" | "patente" | "bailCommercial" | "tpf" | "cfe" | "tascom" | "ir" | "bic" | "bnc" | "isf" | "succession" | "donation" | "tva" | "facture";
export type DeclarationPeriodicity = "mensuelle" | "trimestrielle" | "annuelle";

export interface ObligationStatus {
  assujetti: boolean;
  attachements?: Record<string, string>;
  observations?: string;
}

export interface DeclarationObligationStatus extends ObligationStatus {
  depose: boolean;
  periodicity?: DeclarationPeriodicity;
  dateDepot?: string;
  regime?: string;
}

export interface TaxObligationStatus extends ObligationStatus {
  assujetti: boolean;
  payee: boolean;
  dateEcheance?: string;
  datePaiement?: string;
  montant?: number;
  methodePaiement?: string;
  referencePaiement?: string;
  attachements?: Record<string, string>;
  observations?: string;
  // IGS-specific fields
  caValue?: number;
  isCGA?: boolean;
  classe?: number | string;
  q1Payee?: boolean;
  q2Payee?: boolean;
  q3Payee?: boolean;
  q4Payee?: boolean;
  q1Date?: string;
  q2Date?: string;
  q3Date?: string;
  q4Date?: string;
  q1Montant?: number;
  q2Montant?: number;
  q3Montant?: number;
  q4Montant?: number;
  montantAnnuel?: number;
}

export interface IgsObligationStatus extends TaxObligationStatus {
  caValue?: number;
  isCGA?: boolean;
}

export interface ObligationStatuses {
  igs?: TaxObligationStatus;
  patente?: TaxObligationStatus;
  bailCommercial?: TaxObligationStatus;
  tpf?: TaxObligationStatus;
  cfe?: DeclarationObligationStatus;
  tascom?: DeclarationObligationStatus;
  ir?: DeclarationObligationStatus;
  bic?: DeclarationObligationStatus;
  bnc?: DeclarationObligationStatus;
  isf?: DeclarationObligationStatus;
  succession?: DeclarationObligationStatus;
  donation?: DeclarationObligationStatus;
  tva?: DeclarationObligationStatus;
  facture?: DeclarationObligationStatus;
}

export interface ClientFiscalData {
  clientId: string;
  year: string;
  attestation: {
    creationDate: string;
    validityEndDate: string;
    showInAlert: boolean;
  };
  obligations?: Record<string, ObligationStatuses>;
  hiddenFromDashboard: boolean;
  selectedYear: string;
  updatedAt?: string;
}
