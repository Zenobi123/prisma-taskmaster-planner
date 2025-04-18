
export type ObligationType = "tax" | "declaration";

export interface IgsPaymentStatus {
  isPaid: boolean;
  datePayment?: string;
}

export interface TaxObligationStatus {
  assujetti: boolean;
  paye: boolean;
  montant?: number;
  datePaiement?: string;
  observations?: string;
  chiffreAffaires?: number;
  classeIGS?: number;
  reductionCGA?: boolean;
  paiementsTrimestriels?: {
    T1?: IgsPaymentStatus; // 15 janvier
    T2?: IgsPaymentStatus; // 15 avril
    T3?: IgsPaymentStatus; // 15 juillet
    T4?: IgsPaymentStatus; // 15 octobre
  };
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
  dateDepot?: string;
  observations?: string;
}

export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus;

export interface ObligationStatuses {
  [key: string]: ObligationStatus;
  igs: TaxObligationStatus;
  patente: TaxObligationStatus;
  dsf: DeclarationObligationStatus;
}

export interface ClientFiscalData {
  attestation?: {
    creationDate: string | null;
    validityEndDate: string | null;
    showInAlert: boolean;
  };
  obligations?: ObligationStatuses;
  hiddenFromDashboard?: boolean;
  updatedAt?: string;
}
