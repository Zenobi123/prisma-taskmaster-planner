
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

// Export CGAClasse type directly from here
export type CGAClasse = "classe1" | "classe2" | "classe3" | "classe4" | "classe5" | 
  "classe6" | "classe7" | "classe8" | "classe9" | "classe10";

// Add Etablissement type or make sure it's imported from client.ts
export interface Etablissement {
  nom: string;
  activite: string;
  ville: string;
  departement: string;
  quartier: string;
  chiffreAffaires: number;
}
