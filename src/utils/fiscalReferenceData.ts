
// Données fiscales de référence partagées entre Factures et Devis
// Basées sur la législation fiscale camerounaise

export interface PredefinedPrestation {
  description: string;
  type: "impot" | "honoraire";
}

// Prestations prédéfinies (impôts et honoraires)
export const PREDEFINED_PRESTATIONS: PredefinedPrestation[] = [
  // Impôts
  { description: "IGS", type: "impot" },
  { description: "Patente", type: "impot" },
  { description: "TDL", type: "impot" },
  { description: "PSL", type: "impot" },
  { description: "Bail Commercial", type: "impot" },
  { description: "Taxe Foncière", type: "impot" },
  { description: "DSF", type: "impot" },
  { description: "DARP", type: "impot" },
  { description: "Solde IR/IS", type: "impot" },
  { description: "IRPP", type: "impot" },
  { description: "TVA", type: "impot" },
  { description: "AIS", type: "impot" },
  { description: "CCF", type: "impot" },
  { description: "CAC", type: "impot" },
  { description: "RAV", type: "impot" },
  // Honoraires
  { description: "Tenue de comptabilité", type: "honoraire" },
  { description: "Conseil fiscal", type: "honoraire" },
  { description: "Établissement des états financiers", type: "honoraire" },
  { description: "Assistance contrôle fiscal", type: "honoraire" },
  { description: "Gestion fiscale", type: "honoraire" },
  { description: "DBEF", type: "honoraire" },
  { description: "ATTIM", type: "honoraire" },
  { description: "ACF", type: "honoraire" },
  { description: "Création d'entreprise", type: "honoraire" },
  { description: "Modification statutaire", type: "honoraire" },
];

// Barèmes TDL (Taxe de Développement Local) - 9 tranches
export const TDL_BRACKETS = [
  { min: 0, max: 30000, montant: 7500 },
  { min: 30001, max: 50000, montant: 12500 },
  { min: 50001, max: 75000, montant: 17500 },
  { min: 75001, max: 100000, montant: 22500 },
  { min: 100001, max: 150000, montant: 30000 },
  { min: 150001, max: 200000, montant: 40000 },
  { min: 200001, max: 300000, montant: 55000 },
  { min: 300001, max: 500000, montant: 75000 },
  { min: 500001, max: Infinity, montant: 90000 },
];

// Barèmes d'honoraires par régime fiscal
export type RegimeFiscal = "reel" | "igs" | "non_professionnel" | "obnl";

export interface FeeSchedule {
  description: string;
  montant: number;
}

export const FEE_SCHEDULES: Record<RegimeFiscal, FeeSchedule[]> = {
  reel: [
    { description: "DSF", montant: 100000 },
    { description: "Gestion fiscale", montant: 120000 },
    { description: "Tenue de comptabilité", montant: 100000 },
    { description: "Établissement des états financiers", montant: 150000 },
    { description: "Assistance contrôle fiscal", montant: 200000 },
  ],
  igs: [
    { description: "DSF", montant: 30000 },
    { description: "Gestion fiscale", montant: 50000 },
    { description: "Tenue de comptabilité", montant: 50000 },
    { description: "Établissement des états financiers", montant: 75000 },
    { description: "Assistance contrôle fiscal", montant: 100000 },
  ],
  non_professionnel: [
    { description: "DSF", montant: 15000 },
    { description: "Gestion fiscale", montant: 20000 },
    { description: "Tenue de comptabilité", montant: 20000 },
    { description: "Établissement des états financiers", montant: 25000 },
    { description: "Assistance contrôle fiscal", montant: 30000 },
  ],
  obnl: [
    { description: "DSF", montant: 50000 },
    { description: "Gestion fiscale", montant: 60000 },
    { description: "Tenue de comptabilité", montant: 50000 },
    { description: "Établissement des états financiers", montant: 60000 },
    { description: "Assistance contrôle fiscal", montant: 50000 },
  ],
};

// Prestations communes avec tarifs fixes
export const COMMON_SERVICES: FeeSchedule[] = [
  { description: "DARP", montant: 5000 },
  { description: "DBEF", montant: 5000 },
  { description: "ACF", montant: 2100 },
  { description: "ATTIM", montant: 2100 },
  { description: "Conseil fiscal", montant: 25000 },
  { description: "Création d'entreprise", montant: 75000 },
  { description: "Modification statutaire", montant: 50000 },
];

// Taux Patente: 0.283% du chiffre d'affaires
export const PATENTE_RATE = 0.00283;

// PSL: 10% du loyer
export const PSL_RATE = 0.10;
