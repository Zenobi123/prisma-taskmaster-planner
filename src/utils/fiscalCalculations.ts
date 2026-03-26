import { RegimeFiscal } from "@/types/client";

// === TYPES ===

export type Civilite = "M." | "Mme";
export type ModePaiement = "trimestriel" | "annuel";

export interface FiscalInput {
  regimeFiscal: RegimeFiscal;
  chiffreAffaires: number;
  isCGA: boolean;
  isVendeurBoissons: boolean;
  modePaiementIGS: ModePaiement;
  situationImmobiliere?: {
    type: "proprietaire" | "locataire" | "les_deux";
    loyerMensuel?: number;
    valeurBien?: number;
  };
  modePaiementPSL?: ModePaiement;
}

export interface FiscalResult {
  igs: number;
  igsClasse: number;
  patente: number;
  tdl: number;
  soldeIR: number;
  licence: number;
  psl: number;
  bail: number;
  tauxBail: number;
  tf: number;
  loyerAnnuel: number;
}

// === IGS CALCULATION ===
// Bareme IGS (Article C 40 LPF)

const IGS_BAREME: { max: number; montant: number }[] = [
  { max: 500_000, montant: 20_000 },
  { max: 1_000_000, montant: 30_000 },
  { max: 1_500_000, montant: 40_000 },
  { max: 2_000_000, montant: 50_000 },
  { max: 2_500_000, montant: 60_000 },
  { max: 5_000_000, montant: 150_000 },
  { max: 10_000_000, montant: 300_000 },
  { max: 20_000_000, montant: 500_000 },
  { max: 30_000_000, montant: 1_000_000 },
  { max: 50_000_000, montant: 2_000_000 },
];

export function calculateIGS(ca: number, isCGA: boolean): { montant: number; classe: number } {
  let classe = 1;
  let montant = IGS_BAREME[0].montant;

  for (let i = 0; i < IGS_BAREME.length; i++) {
    if (ca < IGS_BAREME[i].max) {
      classe = i + 1;
      montant = IGS_BAREME[i].montant;
      break;
    }
    if (i === IGS_BAREME.length - 1) {
      classe = i + 1;
      montant = IGS_BAREME[i].montant;
    }
  }

  if (isCGA) {
    montant = Math.round(montant * 0.5);
  }

  return { montant, classe };
}

// === PATENTE CALCULATION ===

export function calculatePatente(ca: number): number {
  const raw = ca * 0.00283;
  const clamped = Math.max(141_500, Math.min(raw, 4_500_000));
  return Math.round(clamped);
}

// === TDL (Taxe de Developpement Local) ===

const TDL_BAREME: Record<number, number> = {
  20_000: 5_000,
  30_000: 7_500,
  40_000: 10_000,
  50_000: 12_500,
  60_000: 15_000,
  150_000: 37_500,
  300_000: 75_000,
  500_000: 125_000,
  1_000_000: 250_000,
  2_000_000: 500_000,
};

export function calculateTDL(regimeFiscal: RegimeFiscal, igsBase: number, patente: number): number {
  if (regimeFiscal === "non_professionnel") {
    return 0;
  }

  if (regimeFiscal === "reel") {
    return Math.round(patente * 0.1);
  }

  // Regime IGS: lookup from bareme using the IGS principal (before CGA reduction)
  return TDL_BAREME[igsBase] ?? 0;
}

// === SOLDE IR ===

export function calculateSoldeIR(regimeFiscal: RegimeFiscal, ca: number): number {
  if (regimeFiscal !== "reel") {
    return 0;
  }

  const calculated = Math.round(ca * 0.02);
  return Math.max(calculated, 500_000);
}

// === LICENCE VENDEUR BOISSONS ===

export function calculateLicence(
  regimeFiscal: RegimeFiscal,
  igs: number,
  patente: number,
  isVendeur: boolean
): number {
  if (!isVendeur) {
    return 0;
  }

  if (regimeFiscal === "igs") {
    return igs * 2;
  }

  if (regimeFiscal === "reel") {
    return patente * 2;
  }

  return 0;
}

// === PSL (Precompte sur Loyer) ===

export function calculatePSL(loyerAnnuel: number, regimeFiscal: RegimeFiscal): number {
  if (regimeFiscal === "non_professionnel") {
    return 0;
  }

  return Math.round(loyerAnnuel * 0.1);
}

// === BAIL COMMERCIAL ===

export function calculateBail(
  loyerAnnuel: number,
  regimeFiscal: RegimeFiscal
): { montant: number; taux: number } {
  const taux = regimeFiscal === "non_professionnel" ? 5 : 10;
  const montant = Math.round(loyerAnnuel * (taux / 100));

  return { montant, taux };
}

// === TAXE FONCIERE ===

export function calculateTF(valeurBien: number): number {
  return Math.round(valeurBien * 0.001);
}

// === MAIN CALCULATION ===

export function calculateAllTaxes(input: FiscalInput): FiscalResult {
  const {
    regimeFiscal,
    chiffreAffaires,
    isCGA,
    isVendeurBoissons,
    situationImmobiliere,
  } = input;

  // IGS: only for regime "igs"
  let igs = 0;
  let igsClasse = 0;
  let igsBase = 0; // IGS principal before CGA reduction (needed for TDL)

  if (regimeFiscal === "igs") {
    // Calculate IGS base (without CGA) for TDL lookup
    const igsBaseResult = calculateIGS(chiffreAffaires, false);
    igsBase = igsBaseResult.montant;

    // Calculate actual IGS (with CGA if applicable)
    const igsResult = calculateIGS(chiffreAffaires, isCGA);
    igs = igsResult.montant;
    igsClasse = igsResult.classe;
  }

  // Patente: only for regime "reel"
  const patente = regimeFiscal === "reel" ? calculatePatente(chiffreAffaires) : 0;

  // TDL
  const tdl = calculateTDL(regimeFiscal, igsBase, patente);

  // Solde IR
  const soldeIR = calculateSoldeIR(regimeFiscal, chiffreAffaires);

  // Licence
  const licence = calculateLicence(regimeFiscal, igs, patente, isVendeurBoissons);

  // Determine loyer annuel and valeur bien from situation immobiliere
  const sitType = situationImmobiliere?.type;
  const loyerMensuel = situationImmobiliere?.loyerMensuel ?? 0;
  const valeurBien = situationImmobiliere?.valeurBien ?? 0;

  const isLocataire = sitType === "locataire" || sitType === "les_deux";
  const isProprietaire = sitType === "proprietaire" || sitType === "les_deux";

  const loyerAnnuel = isLocataire ? loyerMensuel * 12 : 0;

  // PSL: only for locataires, not for non_professionnel
  const psl = isLocataire ? calculatePSL(loyerAnnuel, regimeFiscal) : 0;

  // Bail: only for locataires
  const bailResult = isLocataire
    ? calculateBail(loyerAnnuel, regimeFiscal)
    : { montant: 0, taux: regimeFiscal === "non_professionnel" ? 5 : 10 };

  // Taxe fonciere: only for proprietaires
  const tf = isProprietaire ? calculateTF(valeurBien) : 0;

  return {
    igs,
    igsClasse,
    patente,
    tdl,
    soldeIR,
    licence,
    psl,
    bail: bailResult.montant,
    tauxBail: bailResult.taux,
    tf,
    loyerAnnuel,
  };
}

// === FORMATTING ===

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F CFA";
}
