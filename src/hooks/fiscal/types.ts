
export interface ClientFiscalData {
  attestation: {
    creationDate: string;
    validityEndDate: string;
    showInAlert?: boolean;
  };
  obligations: {
    patente: { assujetti: boolean; paye: boolean };
    bail: { assujetti: boolean; paye: boolean };
    taxeFonciere: { assujetti: boolean; paye: boolean };
    dsf: { assujetti: boolean; depose: boolean };
    darp: { assujetti: boolean; depose: boolean };
  };
  hiddenFromDashboard?: boolean;
  igs?: {
    soumisIGS: boolean;
    adherentCGA: boolean;
    classeIGS?: CGAClasse;
  };
}

export type ObligationType = "patente" | "bail" | "taxeFonciere" | "dsf" | "darp";

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
};

export interface FiscalAttestationData {
  creationDate: string;
  validityEndDate: string;
  showInAlert?: boolean;
}

export type CGAClasse = "classe1" | "classe2" | "classe3" | "classe4" | "classe5" | 
  "classe6" | "classe7" | "classe8" | "classe9" | "classe10";
