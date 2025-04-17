
export type ObligationType = "patente" | "igs" | "bail" | "taxeFonciere" | "dsf" | "darp";

export interface TaxObligationStatus {
  assujetti: boolean;
  paye: boolean;
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
}

export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus;

export type ObligationStatuses = {
  patente: TaxObligationStatus;
  igs: TaxObligationStatus;
  bail: TaxObligationStatus;
  taxeFonciere: TaxObligationStatus;
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
};

export interface FiscalAttestationData {
  creationDate: string;
  validityEndDate: string;
  showInAlert?: boolean; // Add property to control alert visibility
}

// Re-export IGSData types from igsTypes.ts to maintain consistency
export { type Establishment, type IGSData } from './types/igsTypes';

export interface ClientFiscalData {
  attestation: FiscalAttestationData;
  obligations: ObligationStatuses;
  hiddenFromDashboard?: boolean; // Add property to hide from dashboard
  igs?: IGSData; // Add IGS data
}
