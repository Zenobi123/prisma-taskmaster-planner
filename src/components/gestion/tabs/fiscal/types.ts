
export type ObligationType = "patente" | "bail" | "taxeFonciere" | "dsf" | "darp" | "tva" | "cnps";

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
  bail: TaxObligationStatus;
  taxeFonciere: TaxObligationStatus;
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
  tva: TaxObligationStatus;
  cnps: TaxObligationStatus;
};

export interface FiscalAttestationData {
  creationDate: string;
  validityEndDate: string;
  showInAlert?: boolean; // Add property to control alert visibility
}

export interface ClientFiscalData {
  attestation: FiscalAttestationData;
  obligations: ObligationStatuses;
  hiddenFromDashboard?: boolean;
  igs?: any;
}

// Export CGAClasse type directly from here as well
export type CGAClasse = "classe1" | "classe2" | "classe3" | "classe4" | "classe5" | 
  "classe6" | "classe7" | "classe8" | "classe9" | "classe10";
