// SPEC_LOVABLE.md §2 — Constantes fiscales partagées (source unique de vérité)
// Ne pas dupliquer ces valeurs ailleurs.

// === BARÈME IGS (Article C 40 alinéa 1 LPF) ===
export const BAREME_IGS = [
  { classe: 1, min: 0, max: 499_999, montant: 20_000 },
  { classe: 2, min: 500_000, max: 999_999, montant: 30_000 },
  { classe: 3, min: 1_000_000, max: 1_499_999, montant: 40_000 },
  { classe: 4, min: 1_500_000, max: 1_999_999, montant: 50_000 },
  { classe: 5, min: 2_000_000, max: 2_499_999, montant: 60_000 },
  { classe: 6, min: 2_500_000, max: 4_999_999, montant: 150_000 },
  { classe: 7, min: 5_000_000, max: 9_999_999, montant: 300_000 },
  { classe: 8, min: 10_000_000, max: 19_999_999, montant: 500_000 },
  { classe: 9, min: 20_000_000, max: 29_999_999, montant: 1_000_000 },
  { classe: 10, min: 30_000_000, max: 49_999_999, montant: 2_000_000 },
] as const;

// === PATENTE (Moyennes Entreprises, régime Réel) ===
export const PATENTE_TAUX = 0.00283;
export const PATENTE_PLANCHER = 141_500;
export const PATENTE_PLAFOND = 4_500_000;

// === SOLDE IR / IS ===
export const SOLDE_IR_TAUX = 0.001;
export const SOLDE_IR_SEUIL = 15_000_000;

// === BARÈME TDL (sur IGS principal) ===
export const BAREME_TDL = [
  { max: 30_000, montant: 7_500 },
  { max: 60_000, montant: 9_000 },
  { max: 100_000, montant: 15_000 },
  { max: 150_000, montant: 22_500 },
  { max: 200_000, montant: 30_000 },
  { max: 300_000, montant: 45_000 },
  { max: 400_000, montant: 60_000 },
  { max: 500_000, montant: 75_000 },
  { max: Number.POSITIVE_INFINITY, montant: 90_000 },
] as const;

// === PÉNALITÉS IGS ===
export const PENALITE_IGS_TAUX = 0.10; // 10 % par mois de retard

// === IMMOBILIER ===
export const PSL_TAUX = 0.10;          // 10 % du loyer annuel (sauf OBNL/NonPro)
export const BAIL_TAUX_NORMAL = 0.10;  // 10 %
export const BAIL_TAUX_OBNL = 0.05;    // 5 % (OBNL / NonPro)
export const TF_TAUX = 0.001;          // 0,1 % de la valeur du bien

// === ÉCHÉANCES TRIMESTRIELLES IGS / PSL ===
export const ECHEANCES_TRIMESTRIELLES = [
  { trimestre: 1, mois: 0, jour: 15, label: '15 Janvier' },
  { trimestre: 2, mois: 2, jour: 15, label: '15 Mars' },
  { trimestre: 3, mois: 6, jour: 15, label: '15 Juillet' },
  { trimestre: 4, mois: 9, jour: 15, label: '15 Octobre' },
] as const;

// === ÉCHÉANCES ANNUELLES (mémo) ===
// IGS annuel : 1er Mars (péribilité au 1er Avril)
// Patente : 28 Février
// Bail Commercial / TF : annuel
// DSF : 15 Mars — DARP : 30 Juin — DBEF : 30 Juin

// === CGA ===
export const CGA_REDUCTION = 0.5; // 50 % de l'IGS pour adhérents

// === LICENCE BOISSONS ===
export const LICENCE_MULTIPLIER = 2;

// === TYPES PARTAGÉS ===
export type RegimeFiscalSpec = 'IGS' | 'Reel' | 'NonPro' | 'OBNL';
export type TypeClientSpec = 'Personne morale' | 'Personne physique';
export type CiviliteSpec = 'M.' | 'Mme';
export type StatutImmoSpec = '' | 'Locataire' | 'Proprietaire' | 'Les deux';
export type ModePaiementSpec = 'annuel' | 'trimestriel';
