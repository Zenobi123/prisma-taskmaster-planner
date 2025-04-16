
// Types pour les statuts des obligations fiscales
export interface ObligationStatus {
  assujetti: boolean;
  paye?: boolean;
  depose?: boolean;
}

// Types pour l'ensemble des obligations fiscales
export interface ObligationStatuses {
  patente: ObligationStatus;
  bail: ObligationStatus;
  taxeFonciere: ObligationStatus;
  dsf: ObligationStatus;
  darp: ObligationStatus;
  tva: ObligationStatus;
  cnps: ObligationStatus;
}

// Types pour les classes CGA
export type CGAClasse = "classe1" | "classe2" | "classe3" | "classe4" | "classe5" | 
  "classe6" | "classe7" | "classe8" | "classe9" | "classe10";

// Type pour les établissements
export type Etablissement = {
  nom: string;
  activite: string;
  ville: string;
  departement: string;
  quartier: string;
  chiffreAffaires: number;
};

// Structure des données fiscales
export interface ClientFiscalData {
  attestation?: {
    creationDate: string;
    validityEndDate: string;
    showInAlert: boolean;
  };
  obligations?: ObligationStatuses;
  hiddenFromDashboard?: boolean;
  igs?: any;
}
