// SPEC_LOVABLE.md §5 — Listes prédéfinies, prestations & quick-add (factures / devis)
import type { ClientSpec } from './fiscal';
import { getIGSPenaliteLines, getSoldeTaxLabel, calculateTDL, calculateIGS, getClientBiensImmo, buildImmoTaxLabel } from './fiscal';
import type { RegimeFiscalSpec } from './fiscal-constants';

export type PrestationType = 'Impôt' | 'Honoraire';

export interface Prestation {
  type: PrestationType;
  designation: string;
  qty: number;
  price: number;
  total: number;
}

export interface PrestationDef {
  designation: string;
  montant: number;
}

// === LISTE PRÉDÉFINIE D'IMPÔTS — référence : devis.html (LISTE_IMPOTS, lignes 395-412) ===
// Classification à jour : ACF et ATTIM sont des IMPÔTS (timbre fiscal 2 100 F),
// comme l'Inscription/Cotisation CGA. facture-app.html porte encore l'ancienne
// classification (ACF/ATTIM en honoraires) — c'est devis.html qui fait foi.
export const LISTE_IMPOTS: PrestationDef[] = [
  { designation: 'Précompte sur Loyer (PSL)', montant: 0 },
  { designation: 'Bail Commercial', montant: 0 },
  { designation: 'Taxe Foncière (TPF)', montant: 0 },
  { designation: 'Impôt Général Synthétique (IGS)', montant: 0 },
  { designation: 'Taxe de Développement Local (TDL)', montant: 0 },
  { designation: 'Solde IR', montant: 0 },
  { designation: 'Patente', montant: 0 },
  { designation: 'Impôt sur le Revenu des Personnes Physiques (IRPP)', montant: 0 },
  { designation: 'Taxe sur la Valeur Ajoutée (TVA)', montant: 0 },
  { designation: 'Acompte Impôt sur les Sociétés (AIS)', montant: 0 },
  { designation: 'Contribution au Crédit Foncier (CCF)', montant: 0 },
  { designation: 'Centimes Additionnels Communaux (CAC)', montant: 0 },
  { designation: 'Redevance Audiovisuelle (RAV)', montant: 0 },
  { designation: 'Obtention ACF (Attestation de Conformité Fiscale)', montant: 2_100 },
  { designation: 'Obtention ATTIM (Attestation Immatriculation)', montant: 2_100 },
  { designation: 'Inscription au Centre de Gestion Agréé', montant: 75_000 },
  { designation: 'Cotisation Annuelle au CGA', montant: 50_000 },
];

// === HONORAIRES COMMUNS — référence : devis.html (HONORAIRES_COMMUNS, lignes 415-421) ===
export const HONORAIRES_COMMUNS: PrestationDef[] = [
  { designation: 'Déclaration Annuelle des Revenus des Particuliers (DARP)', montant: 5_000 },
  { designation: 'Déclaration des Bénéficiaires Effectifs (DBEF)', montant: 5_000 },
  { designation: 'Conseil fiscal', montant: 25_000 },
  { designation: "Création d'entreprise", montant: 75_000 },
  { designation: 'Modification statutaire', montant: 50_000 },
];

// === HONORAIRES PAR RÉGIME — SPEC §5.6 ===
export const HONORAIRES_PAR_REGIME: Record<RegimeFiscalSpec, PrestationDef[]> = {
  Reel: [
    { designation: 'Renouvellement du dossier fiscal', montant: 15_000 },
    { designation: 'Montage et mise en ligne DSF', montant: 100_000 },
    { designation: 'Forfait suivi gestion fiscal', montant: 120_000 },
    { designation: 'Tenue de comptabilité mensuelle', montant: 100_000 },
    { designation: 'Établissement des états financiers', montant: 150_000 },
    { designation: 'Assistance contrôle fiscal', montant: 200_000 },
  ],
  IGS: [
    { designation: 'Renouvellement du dossier fiscal', montant: 10_000 },
    { designation: 'Montage et mise en ligne DSF', montant: 30_000 },
    { designation: 'Forfait suivi gestion fiscal', montant: 60_000 },
    { designation: 'Tenue de comptabilité mensuelle', montant: 50_000 },
    { designation: 'Établissement des états financiers', montant: 75_000 },
    { designation: 'Assistance contrôle fiscal', montant: 100_000 },
  ],
  NonPro: [
    { designation: 'Déclaration des revenus fonciers', montant: 15_000 },
    { designation: 'Suivi fiscal annuel', montant: 30_000 },
  ],
  OBNL: [
    { designation: 'Renouvellement du dossier fiscal', montant: 10_000 },
    { designation: 'Montage et mise en ligne DSF', montant: 50_000 },
    { designation: 'Tenue de comptabilité', montant: 60_000 },
  ],
};

// === PRESTATIONS COMMUNES (boutons rapides — SPEC §5.8) ===
// ACF/ATTIM typées Impôt (classification devis.html — timbre fiscal).
export const PRESTATIONS_COMMUNES: Array<PrestationDef & { type: PrestationType }> = [
  { designation: 'Déclaration Annuelle des Revenus des Particuliers (DARP)', montant: 5_000, type: 'Honoraire' },
  { designation: 'Déclaration des Bénéficiaires Effectifs (DBEF)', montant: 5_000, type: 'Honoraire' },
  { designation: 'Obtention ACF (Attestation de Conformité Fiscale)', montant: 2_100, type: 'Impôt' },
  { designation: 'Obtention ATTIM (Attestation Immatriculation)', montant: 2_100, type: 'Impôt' },
];

export const PRESTATIONS_REGIME: Record<RegimeFiscalSpec, Array<PrestationDef & { type: PrestationType }>> = {
  Reel: [
    { designation: 'Renouvellement du dossier fiscal', montant: 15_000, type: 'Honoraire' },
    { designation: 'Montage et mise en ligne DSF', montant: 100_000, type: 'Honoraire' },
    { designation: 'Forfait suivi gestion fiscal', montant: 120_000, type: 'Honoraire' },
  ],
  IGS: [
    { designation: 'Renouvellement du dossier fiscal', montant: 10_000, type: 'Honoraire' },
    { designation: 'Montage et mise en ligne DSF', montant: 30_000, type: 'Honoraire' },
    { designation: 'Forfait suivi gestion fiscal', montant: 60_000, type: 'Honoraire' },
  ],
  NonPro: [],
  OBNL: [],
};

// === Helpers ===

export function getHonorairesForClient(client: ClientSpec | null | undefined): PrestationDef[] {
  const reg = (client?.regimeFiscal || 'IGS') as RegimeFiscalSpec;
  return [...(HONORAIRES_PAR_REGIME[reg] || []), ...HONORAIRES_COMMUNS];
}

export function getImpotsForSelect(client: ClientSpec | null | undefined): PrestationDef[] {
  // Substitue Solde IR / Solde IS selon type client
  const label = getSoldeTaxLabel(client);
  return LISTE_IMPOTS.map((it) =>
    it.designation === 'Solde IR' ? { ...it, designation: label } : it,
  );
}

export function newPrestation(type: PrestationType, designation = '', price = 0, qty = 1): Prestation {
  const total = qty * price;
  return { type, designation, qty, price, total };
}

function alreadyHas(prestations: Prestation[], designationStartsWith: string): boolean {
  return prestations.some((p) => p.designation.startsWith(designationStartsWith));
}

// === Cas spécial IGS (SPEC §5.7) ===
// Ajoute la ligne IGS + automatiquement TDL + Pénalités IGS si applicables.
export function addIGSCascade(prestations: Prestation[], client: ClientSpec): Prestation[] {
  if (!client || client.regimeFiscal !== 'IGS' || !client.igs || client.igs <= 0) return prestations;
  const next = [...prestations];
  const classeRes = calculateIGS(client.chiffreAffaires ?? 0, !!client.isCGA);

  const igsLabel = `Impôt Général Synthétique (IGS) - Classe ${classeRes.classe}${client.isCGA ? ' (CGA)' : ''}`;
  if (!alreadyHas(next, 'Impôt Général Synthétique (IGS)')) {
    next.push(newPrestation('Impôt', igsLabel, classeRes.montant));
  }

  // TDL automatique
  const tdlMontant = calculateTDL(classeRes.montantPrincipal);
  if (tdlMontant > 0 && !alreadyHas(next, 'Taxe de Développement Local (TDL)')) {
    next.push(newPrestation('Impôt', 'Taxe de Développement Local (TDL)', tdlMontant));
  }

  // Pénalités IGS
  for (const pen of getIGSPenaliteLines(client)) {
    if (!alreadyHas(next, pen.designation)) {
      next.push(newPrestation('Impôt', pen.designation, pen.montant));
    }
  }

  return next;
}

// === Boutons rapides "Impôts du client et CGA" (SPEC §5.7) ===
export interface QuickImpotButton {
  key: string;
  label: string;
  color: string;             // tailwind classes
  applies: (c: ClientSpec) => boolean;
  apply: (prestations: Prestation[], c: ClientSpec) => Prestation[];
}

const quickImpotButton = (
  key: string,
  label: string,
  color: string,
  applies: (c: ClientSpec) => boolean,
  designation: string,
  amountFn: (c: ClientSpec) => number,
): QuickImpotButton => ({
  key,
  label,
  color,
  applies,
  apply(prestations, c) {
    if (!applies(c)) return prestations;
    if (alreadyHas(prestations, designation)) return prestations;
    const m = amountFn(c);
    if (m <= 0) return prestations;
    return [...prestations, newPrestation('Impôt', designation, m)];
  },
});

// Boutons statiques (non-immobiliers). Les boutons PSL/Bail/TPF sont désormais
// générés dynamiquement par bien (cf. getQuickImpotButtons).
export const QUICK_IMPOT_BUTTONS: QuickImpotButton[] = [
  // IGS = cas spécial (cascade)
  {
    key: 'igs',
    label: '+ IGS',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    applies: (c) => (c.igs ?? 0) > 0 && c.regimeFiscal === 'IGS',
    apply: (prestations, c) => addIGSCascade(prestations, c),
  },
  quickImpotButton('tdl', '+ TDL', 'bg-teal-100 text-teal-800 hover:bg-teal-200',
    (c) => (c.tdl ?? 0) > 0, 'Taxe de Développement Local (TDL)', (c) => c.tdl ?? 0),
  {
    key: 'solde',
    label: '+ Solde',
    color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    applies: (c) => (c.soldeIR ?? 0) > 0,
    apply(prestations, c) {
      const label = getSoldeTaxLabel(c);
      if (alreadyHas(prestations, label)) return prestations;
      return [...prestations, newPrestation('Impôt', label, c.soldeIR ?? 0)];
    },
  },
  quickImpotButton('patente', '+ Patente', 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    (c) => (c.patente ?? 0) > 0, 'Patente (Régime Réel)', (c) => c.patente ?? 0),
  quickImpotButton('cga_inscription', '+ Inscription CGA', 'bg-sky-100 text-sky-800 hover:bg-sky-200',
    () => true, 'Inscription au Centre de Gestion Agréé', () => 75_000),
  quickImpotButton('cga_cotisation', '+ Cotisation CGA', 'bg-sky-100 text-sky-800 hover:bg-sky-200',
    () => true, 'Cotisation Annuelle au CGA', () => 50_000),
];

// === Génération dynamique des boutons rapides « Impôts du client & CGA » ===
// Ventile PSL / Bail / TPF par bien (multi-agences), puis ajoute les boutons
// fiscaux non-immobiliers applicables.
export function getQuickImpotButtons(client: ClientSpec | null | undefined): QuickImpotButton[] {
  if (!client) return [];
  const colorPSL = 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  const colorBail = 'bg-teal-100 text-teal-800 hover:bg-teal-200';
  const colorTPF = 'bg-orange-100 text-orange-800 hover:bg-orange-200';

  const immoBtns: QuickImpotButton[] = [];
  for (const bien of getClientBiensImmo(client)) {
    if (bien.psl > 0) {
      const desig = buildImmoTaxLabel('PSL', bien);
      immoBtns.push(quickImpotButton(`psl:${desig}`, `+ ${desig}`, colorPSL,
        () => true, desig, () => bien.psl));
    }
    if (bien.bail > 0) {
      const desig = buildImmoTaxLabel('Bail', bien);
      immoBtns.push(quickImpotButton(`bail:${desig}`, `+ ${desig}`, colorBail,
        () => true, desig, () => bien.bail));
    }
    if (bien.tf > 0) {
      const desig = buildImmoTaxLabel('TPF', bien);
      immoBtns.push(quickImpotButton(`tpf:${desig}`, `+ ${desig}`, colorTPF,
        () => true, desig, () => bien.tf));
    }
  }

  const nonImmo = QUICK_IMPOT_BUTTONS.filter((b) => b.applies(client));
  return [...immoBtns, ...nonImmo];
}

// === Numérotation automatique (SPEC §5.2 / §10.3) ===

export function generateFactureNumber(existingCount: number, date: Date = new Date()): string {
  const num = String(existingCount + 1).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `N° ${num}/${date.getFullYear()}/${month}`;
}

export function generateDevisNumber(existingCount: number, date: Date = new Date()): string {
  const num = String(existingCount + 1).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `DEVIS-${num}/${date.getFullYear()}/${month}`;
}

export function generateRecuNumber(existingCount: number, date: Date = new Date()): string {
  const num = String(existingCount + 1).padStart(4, '0');
  return `RECU-${num}/${date.getFullYear()}`;
}

export function computeFactureTotals(prestations: Prestation[]) {
  const totalImpots = prestations.filter((p) => p.type === 'Impôt').reduce((s, p) => s + (p.total || 0), 0);
  const totalHonoraires = prestations.filter((p) => p.type === 'Honoraire').reduce((s, p) => s + (p.total || 0), 0);
  return { totalImpots, totalHonoraires, total: totalImpots + totalHonoraires };
}
