
// Données fiscales de référence partagées entre Factures et Devis
// Basées sur la législation fiscale camerounaise

export interface PredefinedPrestation {
  description: string;
  type: "impot" | "honoraire";
  montant: number;
}

type ClientLike = Record<string, unknown> | null | undefined;

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const readClientAmount = (client: ClientLike, keys: string[]): number => {
  if (!client) return 0;
  for (const key of keys) {
    const direct = toNumber((client as Record<string, unknown>)[key]);
    if (direct > 0) return direct;
    const fiscalData = (client as Record<string, unknown>).fiscal_data as Record<string, unknown> | undefined;
    if (fiscalData) {
      const nested = toNumber(fiscalData[key]);
      if (nested > 0) return nested;
    }
  }
  return 0;
};

// Prestations prédéfinies (impôts et honoraires)
export const PREDEFINED_PRESTATIONS: PredefinedPrestation[] = [
  // Impôts
  { description: "Précompte sur Loyer (PSL)", type: "impot", montant: 0 },
  { description: "Bail Commercial", type: "impot", montant: 0 },
  { description: "Taxe Foncière (TF)", type: "impot", montant: 0 },
  { description: "Impôt Général Synthétique (IGS)", type: "impot", montant: 0 },
  { description: "Taxe de Développement Local (TDL)", type: "impot", montant: 0 },
  { description: "Solde IR", type: "impot", montant: 0 },
  { description: "Patente", type: "impot", montant: 0 },
  { description: "Impôt sur le Revenu des Personnes Physiques (IRPP)", type: "impot", montant: 0 },
  { description: "Taxe sur la Valeur Ajoutée (TVA)", type: "impot", montant: 0 },
  { description: "Acompte Impôt sur les Sociétés (AIS)", type: "impot", montant: 0 },
  { description: "Contribution au Crédit Foncier (CCF)", type: "impot", montant: 0 },
  { description: "Centimes Additionnels Communaux (CAC)", type: "impot", montant: 0 },
  { description: "Redevance Audiovisuelle (RAV)", type: "impot", montant: 0 },
  { description: "Inscription au Centre de Gestion Agréé", type: "impot", montant: 75000 },
  { description: "Cotisation Annuelle au CGA", type: "impot", montant: 50000 },
  // Honoraires
  { description: "Déclaration Annuelle des Revenus des Particuliers (DARP)", type: "honoraire", montant: 5000 },
  { description: "Déclaration des Bénéficiaires Effectifs (DBEF)", type: "honoraire", montant: 5000 },
  { description: "Obtention ACF (Attestation de Conformité Fiscale)", type: "honoraire", montant: 2100 },
  { description: "Obtention ATTIM (Attestation Immatriculation)", type: "honoraire", montant: 2100 },
  { description: "Conseil fiscal", type: "honoraire", montant: 25000 },
  { description: "Création d'entreprise", type: "honoraire", montant: 75000 },
  { description: "Modification statutaire", type: "honoraire", montant: 50000 },
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
    { description: "Gestion fiscale", montant: 60000 },
    { description: "Tenue de comptabilité", montant: 50000 },
    { description: "Établissement des états financiers", montant: 75000 },
    { description: "Assistance contrôle fiscal", montant: 100000 },
  ],
  non_professionnel: [
    { description: "Déclaration des revenus fonciers", montant: 15000 },
    { description: "Suivi fiscal annuel", montant: 30000 },
  ],
  obnl: [
    { description: "Renouvellement du dossier fiscal", montant: 10000 },
    { description: "Montage et mise en ligne DSF", montant: 50000 },
    { description: "Tenue de comptabilité", montant: 60000 },
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

export const resolvePredefinedMontant = (
  prestation: PredefinedPrestation,
  client?: ClientLike
): number => {
  switch (prestation.description) {
    case "Précompte sur Loyer (PSL)":
      return readClientAmount(client, ["psl"]);
    case "Bail Commercial":
      return readClientAmount(client, ["bail"]);
    case "Taxe Foncière (TF)":
      return readClientAmount(client, ["tf"]);
    case "Impôt Général Synthétique (IGS)":
      return readClientAmount(client, ["igs"]);
    case "Patente":
      return readClientAmount(client, ["patente"]);
    case "Solde IR":
      return readClientAmount(client, ["soldeir", "solde_ir", "soldeIR"]);
    default:
      return prestation.montant;
  }
};
