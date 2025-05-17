
import { Client } from "@/types/client";

// Types pour les obligations fiscales
export type ObligationType = 'taxe' | 'declaration';

export type AttachmentType = 'attestation' | 'declaration' | 'receipt' | 'other';

// État d'une obligation fiscale de type taxe (impôt)
export interface TaxObligationStatus {
  assujetti: boolean;
  paye: boolean;
  observations?: string;
  attachments?: Record<string, string>;
  
  // Champs spécifiques pour IGS
  montantAnnuel?: number;
  q1Paye?: boolean;
  q2Paye?: boolean;
  q3Paye?: boolean;
  q4Paye?: boolean;
}

export type DeclarationPeriodicity = 'mensuelle' | 'trimestrielle' | 'annuelle';

// État d'une obligation fiscale de type déclaration
export interface DeclarationObligationStatus {
  applicable: boolean;
  submitted: boolean;
  approved?: boolean;
  observations?: string;
  attachments?: Record<string, string>;
  periodicity?: DeclarationPeriodicity;
}

// Union type pour les deux types d'obligations
export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus;

// Statuts de toutes les obligations fiscales
export interface ObligationStatuses {
  [key: string]: ObligationStatus;
  igs: TaxObligationStatus;
  patente: TaxObligationStatus;
  iba?: TaxObligationStatus;
  baic?: TaxObligationStatus;
  ibnc?: TaxObligationStatus;
  ircm?: TaxObligationStatus;
  irf?: TaxObligationStatus;
  its?: TaxObligationStatus;
  precompte?: TaxObligationStatus;
  taxeSejour?: TaxObligationStatus;
  baillCommercial?: TaxObligationStatus;
  
  // Déclarations
  dsf?: DeclarationObligationStatus;
  darp?: DeclarationObligationStatus;
  licence?: DeclarationObligationStatus;
}

// Structure des données fiscales d'un client
export interface ClientFiscalData {
  attestation?: {
    creationDate: string;
    validityEndDate: string;
    showInAlert: boolean;
  };
  obligations?: {
    [year: string]: ObligationStatuses;
  };
  hiddenFromDashboard?: boolean;
  selectedYear?: string;
  updatedAt?: string;
}
