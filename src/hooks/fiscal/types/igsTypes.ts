
// Types related to IGS (Impôt Général Synthétique)
import { CGAClasse, Etablissement } from "@/hooks/fiscal/types";

// Interface for IGS payment data
export interface IGSPayment {
  montant: string;
  quittance: string;
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
