
export type ObligationType = "tax" | "declaration";
export type DeclarationPeriodicity = "monthly" | "annual";

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
  // New attachment fields for payments
  payment_attachments?: {
    declaration?: string;
    receipt?: string;
  };
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
  dateDepot?: string;
  observations?: string;
  periodicity?: DeclarationPeriodicity; // Nouvelle propriété pour indiquer la périodicité
  // New attachment fields for declarations
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
  baillCommercial: TaxObligationStatus; // Add the new Bail Commercial obligation
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
