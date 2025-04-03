
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
  showInAlert?: boolean; // Property to control alert visibility
}

export interface ClientFiscalData {
  attestation: FiscalAttestationData;
  obligations: ObligationStatuses;
  hiddenFromDashboard?: boolean; // Property to hide from dashboard
}

// Définir un type par défaut pour les données fiscales
export const defaultClientFiscalData: ClientFiscalData = {
  attestation: {
    creationDate: "",
    validityEndDate: "",
    showInAlert: false
  },
  obligations: {
    patente: { assujetti: false, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false }
  },
  hiddenFromDashboard: false
};
