
// Types related to IGS (Impôt Général Synthétique)
import { CGAClasse } from "@/hooks/fiscal/types";

// Interface for IGS payment data
export interface IGSPayment {
  montant: string;
  quittance: string;
}

// Interface for establishment data
export interface Etablissement {
  nom: string;
  activite: string;
  ville: string;
  departement: string;
  quartier: string;
  chiffreAffaires: number;
}

// Interface for complete IGS data
export interface IGSData {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
  completedPayments?: string[];
}

// Interface for the fiscal data structure
export interface FiscalData {
  attestation?: {
    creationDate: string;
    validityEndDate: string;
    showInAlert: boolean;
  };
  obligations?: any;
  hiddenFromDashboard?: boolean;
  igs?: IGSData;
}
