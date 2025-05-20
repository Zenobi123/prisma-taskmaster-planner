
import { Client } from '@/types/client';

export type ObligationType = 'dsf' | 'darp' | 'licence' | 'patente' | 'cntps' | 'igs' | 'precomptes';

export type DeclarationPeriodicity = 'annuelle' | 'trimestrielle' | 'mensuelle';

export interface TaxObligationStatus {
  assujetti: boolean;
  payee: boolean;
  dateEcheance?: string;
  datePaiement?: string;
  dateReglement?: string;
  montant?: number;
  montantAnnuel?: number;
  montantPenalite?: number;
  montantTotal?: number;
  methodePaiement?: string;
  referencePaiement?: string;
  attachements?: Record<string, string | null>;
  observations?: string;
  q1Paye?: boolean;
  q2Paye?: boolean;
  q3Paye?: boolean;
  q4Paye?: boolean;
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
  dateDepot?: string;
  periodicity: DeclarationPeriodicity;
  attachements?: Record<string, string | null>;
  observations?: string;
}

export interface IgsObligationStatus extends TaxObligationStatus {
  chiffreAffaires?: number;
  tauxImposition?: number;
  paiementsTrimestriels: {
    Q1?: {
      payee: boolean;
      montant?: number;
      datePaiement?: string;
    };
    Q2?: {
      payee: boolean;
      montant?: number;
      datePaiement?: string;
    };
    Q3?: {
      payee: boolean;
      montant?: number;
      datePaiement?: string;
    };
    Q4?: {
      payee: boolean;
      montant?: number;
      datePaiement?: string;
    };
  };
}

export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus | IgsObligationStatus;

export interface ObligationStatuses {
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
  licence: DeclarationObligationStatus;
  patente: TaxObligationStatus;
  cntps: TaxObligationStatus;
  igs: IgsObligationStatus;
  precomptes: TaxObligationStatus;
}

export interface ClientFiscalData {
  clientId: string;
  year: string;
  selectedYear?: string;
  attestation?: {
    creationDate: string | null;
    validityEndDate: string | null;
    showInAlert: boolean;
  };
  updatedAt?: string;
  attestationCreatedAt?: string;
  attestationValidUntil?: string;
  showInAlert?: boolean;
  hiddenFromDashboard?: boolean;
  obligations: {
    [year: string]: ObligationStatuses;
  };
}

export interface FiscalDataProps {
  client: Client;
  selectedYear: string;
}
