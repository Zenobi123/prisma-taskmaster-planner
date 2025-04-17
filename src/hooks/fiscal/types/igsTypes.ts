
import { CGAClasse } from "../types";

export interface IGSPayment {
  montant: string;
  quittance: string;
}

export interface Etablissement {
  nom: string;
  activite: string;
  ville: string;
  departement: string;
  quartier: string;
  chiffreAffaires: number;
}

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

export interface FiscalData {
  attestation: {
    creationDate: string;
    validityEndDate: string;
    showInAlert: boolean;
  };
  obligations: {
    patente: { assujetti: boolean; paye: boolean };
    bail: { assujetti: boolean; paye: boolean };
    taxeFonciere: { assujetti: boolean; paye: boolean };
    dsf: { assujetti: boolean; depose: boolean };
    darp: { assujetti: boolean; depose: boolean };
    tva: { assujetti: boolean; paye: boolean };
    cnps: { assujetti: boolean; paye: boolean };
  };
  hiddenFromDashboard: boolean;
  igs: IGSData;
}
