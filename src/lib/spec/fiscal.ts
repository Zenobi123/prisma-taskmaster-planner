// SPEC_LOVABLE.md §2.1 — Fonctions de calcul fiscal (source unique de vérité)
import {
  BAREME_IGS,
  BAREME_TDL,
  PATENTE_TAUX,
  PATENTE_PLANCHER,
  PATENTE_PLAFOND,
  SOLDE_IR_TAUX,
  SOLDE_IR_SEUIL,
  PENALITE_IGS_TAUX,
  PSL_TAUX,
  BAIL_TAUX_NORMAL,
  BAIL_TAUX_OBNL,
  TF_TAUX,
  CGA_REDUCTION,
  LICENCE_MULTIPLIER,
  type CiviliteSpec,
  type RegimeFiscalSpec,
  type StatutImmoSpec,
  type TypeClientSpec,
  type ModePaiementSpec,
} from './fiscal-constants';

// === Modèle Client SPEC ===
// Conforme à SPEC §4.1
export interface ClientSpec {
  id: number;
  type: TypeClientSpec;
  name: string;
  niu: string;
  cdi: string;
  ville: string;
  quartier: string;
  phone: string;
  email?: string;
  contact?: string;
  civilite: CiviliteSpec;
  secteur: string;
  cnps?: string;
  externalise: 'Oui' | 'Non';
  statut: 'Actif' | 'Inactif';
  // Immobilier
  statutImmo?: StatutImmoSpec;
  loyerMensuel?: number;
  loyerAnnuel?: number;
  valeurBien?: number;
  psl?: number;
  bail?: number;
  tauxBail?: 10 | 5;
  tf?: number;
  // Fiscal
  regimeFiscal?: '' | RegimeFiscalSpec;
  chiffreAffaires?: number;
  isCGA?: boolean;
  isVendeurBoissons?: boolean;
  modePaiementIGS: ModePaiementSpec;
  modePaiementPSL: ModePaiementSpec;
  igs?: number;
  igsClasse?: number;
  patente?: number;
  tdl?: number;
  soldeIR?: number;
  licence?: number;
  createdAt: string;
  // Multi-agences (établissements). Si présent, les calculs immobiliers se font
  // par bien et le CA est cumulé sur l'ensemble des agences.
  agences?: AgenceSpec[];
}

export interface AgenceSpec {
  libelle: string;
  ville: string;
  quartier: string;
  principale: boolean;
  chiffreAffaires: number;
  statutImmo: 'locataire' | 'proprietaire' | 'les_deux' | '';
  loyerMensuel: number;
  valeurBien: number;
}

export interface BienImmo {
  libelle: string;
  ville: string;
  quartier: string;
  psl: number;
  bail: number;
  tf: number;
  tauxBail: 10 | 5;
}

export interface IGSResult {
  montant: number;          // après éventuelle réduction CGA
  montantPrincipal: number; // avant réduction CGA (utilisé pour TDL)
  classe: number;
  horsBareme: boolean;
}

export function calculateIGS(ca: number, isCGA: boolean): IGSResult {
  for (const t of BAREME_IGS) {
    if (ca >= t.min && ca <= t.max) {
      const montantPrincipal = t.montant;
      const montant = isCGA
        ? Math.round(montantPrincipal * CGA_REDUCTION)
        : montantPrincipal;
      return { montant, montantPrincipal, classe: t.classe, horsBareme: false };
    }
  }
  return { montant: 0, montantPrincipal: 0, classe: 0, horsBareme: true };
}

export interface PatenteResult {
  montant: number;
  montantCalcule: number;
  taux: number;
  plancher: number;
  plafond: number;
}

export function calculatePatente(ca: number): PatenteResult {
  const montantCalcule = Math.round(ca * PATENTE_TAUX);
  let montant = montantCalcule;
  if (montantCalcule < PATENTE_PLANCHER) montant = PATENTE_PLANCHER;
  else if (montantCalcule > PATENTE_PLAFOND) montant = PATENTE_PLAFOND;
  return {
    montant,
    montantCalcule,
    taux: PATENTE_TAUX * 100,
    plancher: PATENTE_PLANCHER,
    plafond: PATENTE_PLAFOND,
  };
}

export function calculateSoldeIR(ca: number): { montant: number; applicable: boolean } {
  const applicable = ca >= SOLDE_IR_SEUIL;
  return { montant: applicable ? Math.round(ca * SOLDE_IR_TAUX) : 0, applicable };
}

export function calculateTDL(montantIGSPrincipal: number): number {
  const m = Math.round(montantIGSPrincipal || 0);
  if (m <= 0) return 0;
  const t = BAREME_TDL.find((item) => m <= item.max);
  return t ? t.montant : 0;
}

export interface ImmoResult {
  psl: number;
  bail: number;
  tf: number;
  tauxBail: 10 | 5;
}

export function calculateImmoTaxes(client: ClientSpec): ImmoResult {
  const isOBNLorNonPro =
    client.regimeFiscal === 'OBNL' || client.regimeFiscal === 'NonPro';
  let psl = 0;
  let bail = 0;
  let tf = 0;
  let tauxBail: 10 | 5 = 10;
  const loyerAnnuel = client.loyerAnnuel ?? (client.loyerMensuel ? client.loyerMensuel * 12 : 0);

  if (client.statutImmo === 'Locataire' || client.statutImmo === 'Les deux') {
    if (!isOBNLorNonPro) psl = Math.round(loyerAnnuel * PSL_TAUX);
    tauxBail = isOBNLorNonPro ? 5 : 10;
    const tauxFloat = isOBNLorNonPro ? BAIL_TAUX_OBNL : BAIL_TAUX_NORMAL;
    bail = Math.round(loyerAnnuel * tauxFloat);
  }
  if (client.statutImmo === 'Proprietaire' || client.statutImmo === 'Les deux') {
    tf = Math.round((client.valeurBien ?? 0) * TF_TAUX);
  }

  return { psl, bail, tf, tauxBail };
}

export function getSoldeTaxLabel(client: Pick<ClientSpec, 'type'> | undefined | null): 'Solde IR' | 'Solde IS' {
  return client?.type === 'Personne morale' ? 'Solde IS' : 'Solde IR';
}

export function calculateLicence(
  regime: RegimeFiscalSpec | '' | undefined,
  igs: number,
  patente: number,
  isVendeurBoissons: boolean | undefined,
): number {
  if (!isVendeurBoissons) return 0;
  if (regime === 'IGS') return Math.round(igs * LICENCE_MULTIPLIER);
  if (regime === 'Reel') return Math.round(patente * LICENCE_MULTIPLIER);
  return 0;
}

// === Calcul global ===
export interface FullFiscalResult {
  igs: number;
  igsClasse: number;
  igsHorsBareme: boolean;
  patente: number;
  tdl: number;
  soldeIR: number;
  soldeIRApplicable: boolean;
  licence: number;
  psl: number;
  bail: number;
  tauxBail: 10 | 5;
  tf: number;
  loyerAnnuel: number;
  total: number;
}

export function computeAllTaxes(client: ClientSpec): FullFiscalResult {
  const ca = client.chiffreAffaires ?? 0;
  const regime = client.regimeFiscal || '';
  const isCGA = !!client.isCGA;

  const igsRes =
    regime === 'IGS' ? calculateIGS(ca, isCGA) : { montant: 0, montantPrincipal: 0, classe: 0, horsBareme: false };
  const patente = regime === 'Reel' ? calculatePatente(ca).montant : 0;
  const tdl = regime === 'IGS' ? calculateTDL(igsRes.montantPrincipal) : 0;
  const soldeRes = regime === 'IGS' || regime === 'Reel' ? calculateSoldeIR(ca) : { montant: 0, applicable: false };
  const licence = calculateLicence(regime, igsRes.montant, patente, client.isVendeurBoissons);

  const loyerAnnuel = client.loyerMensuel ? client.loyerMensuel * 12 : (client.loyerAnnuel ?? 0);
  const immo = calculateImmoTaxes({ ...client, loyerAnnuel });

  const total =
    igsRes.montant + patente + tdl + soldeRes.montant + licence + immo.psl + immo.bail + immo.tf;

  return {
    igs: igsRes.montant,
    igsClasse: igsRes.classe,
    igsHorsBareme: igsRes.horsBareme,
    patente,
    tdl,
    soldeIR: soldeRes.montant,
    soldeIRApplicable: soldeRes.applicable,
    licence,
    psl: immo.psl,
    bail: immo.bail,
    tauxBail: immo.tauxBail,
    tf: immo.tf,
    loyerAnnuel,
    total,
  };
}

// === Format & Normalisation ===

export function formatMoney(amount: number | undefined | null): string {
  return `${Math.round(amount || 0).toLocaleString('fr-FR')} F CFA`;
}

export function normalizeCivilite(value: string | undefined, fallback: CiviliteSpec = 'M.'): CiviliteSpec {
  const n = String(value || '').trim().toLowerCase();
  if (['mme', 'madame', 'f', 'femme', 'feminin', 'féminin'].includes(n)) return 'Mme';
  if (['m.', 'm', 'mr', 'monsieur', 'h', 'homme', 'masculin'].includes(n)) return 'M.';
  return fallback;
}

export function getCiviliteLongue(civilite: CiviliteSpec | undefined | null): 'Madame' | 'Monsieur' {
  return civilite === 'Mme' ? 'Madame' : 'Monsieur';
}

// === Annexe D : pénalités IGS pour facturation ===

function stripTime(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(d: Date, days: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
}

function getMoisRetard(start: Date, end: Date): number {
  const s = stripTime(start);
  const e = stripTime(end);
  if (e < s) return 0;
  let mois =
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth());
  if (e.getDate() >= s.getDate()) mois += 1;
  return Math.max(mois, 1);
}

function splitAmount(total: number, count: number): number[] {
  const base = Math.floor(total / count);
  const rem = total - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0));
}

export interface PenaliteIGSLine {
  designation: string;
  montant: number;
}

export function getIGSPenaliteLines(client: ClientSpec | null | undefined, today: Date = new Date()): PenaliteIGSLine[] {
  if (!client || client.regimeFiscal !== 'IGS' || !client.igs || client.igs <= 0) return [];

  const t = stripTime(today);
  const year = t.getFullYear();
  const mode = client.modePaiementIGS || 'annuel';
  type Schedule = { label: string; amount: number; penaltyStart: Date };
  let schedule: Schedule[];

  if (mode === 'trimestriel') {
    const fractions = splitAmount(Math.round(client.igs), 4);
    const dueDates = [
      new Date(year, 0, 15),
      new Date(year, 2, 15),
      new Date(year, 6, 15),
      new Date(year, 9, 15),
    ];
    schedule = dueDates.map((dueDate, i) => ({
      label: `T${i + 1}`,
      amount: fractions[i],
      penaltyStart: addDays(dueDate, 30),
    }));
  } else {
    schedule = [
      {
        label: 'Annuel',
        amount: Math.round(client.igs),
        penaltyStart: new Date(year, 3, 1), // 1er avril
      },
    ];
  }

  return schedule
    .map((item) => {
      const ps = stripTime(item.penaltyStart);
      if (t < ps) return null;
      const moisRetard = getMoisRetard(ps, t);
      const montant = Math.round(item.amount * PENALITE_IGS_TAUX * moisRetard);
      return montant > 0
        ? {
            designation: `Pénalités IGS - ${item.label} (${moisRetard} mois)`,
            montant,
          }
        : null;
    })
    .filter((x): x is PenaliteIGSLine => x !== null);
}

// === Sanitization du nom de fichier PDF (SPEC §10.5) ===
export function sanitizePdfSegment(value: string | undefined, fallback = 'Document'): string {
  return (
    String(value || '')
      .replace(/^N[°ºo]?\s*/i, '')
      .replace(/[/\\]/g, '-')
      .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '')
      .trim() || fallback
  );
}

// === Adapter : convertir un Client (modèle existant) vers ClientSpec ===
export interface ExistingClientLike {
  id: string | number;
  type?: 'physique' | 'morale' | string;
  nom?: string;
  raisonsociale?: string;
  niu?: string;
  centrerattachement?: string;
  adresse?: { ville?: string; quartier?: string };
  contact?: { telephone?: string; email?: string; contact_principal?: string };
  secteuractivite?: string;
  numerocnps?: string;
  gestionexternalisee?: boolean;
  statut?: string;
  civilite?: string;
  regimefiscal?: string;
  chiffreaffaires?: number;
  iscga?: boolean;
  isvendeurboissons?: boolean;
  modepaiementigs?: 'trimestriel' | 'annuel';
  modepaiementpsl?: 'trimestriel' | 'annuel';
  situationimmobiliere?: { type?: string; valeur?: number; loyer?: number };
  fiscal_data?: unknown;
  created_at?: string;
}

const REGIME_ADAPTER: Record<string, RegimeFiscalSpec | ''> = {
  igs: 'IGS',
  reel: 'Reel',
  non_professionnel: 'NonPro',
  obnl: 'OBNL',
};

const STATUT_IMMO_ADAPTER: Record<string, StatutImmoSpec> = {
  proprietaire: 'Proprietaire',
  locataire: 'Locataire',
  les_deux: 'Les deux',
};

export function adaptClient(c: ExistingClientLike): ClientSpec {
  const type: TypeClientSpec = c.type === 'morale' ? 'Personne morale' : 'Personne physique';
  const regime = (REGIME_ADAPTER[(c.regimefiscal ?? '').toLowerCase()] ?? '') as ClientSpec['regimeFiscal'];
  const statutImmo: StatutImmoSpec =
    STATUT_IMMO_ADAPTER[(c.situationimmobiliere?.type ?? '').toLowerCase()] ?? '';
  const loyerMensuel = c.situationimmobiliere?.loyer ?? 0;
  const valeurBien = c.situationimmobiliere?.valeur ?? 0;

  const partial: ClientSpec = {
    id: typeof c.id === 'number' ? c.id : Date.now(),
    type,
    name: c.raisonsociale || c.nom || '',
    niu: c.niu || '',
    cdi: c.centrerattachement || '',
    ville: c.adresse?.ville || '',
    quartier: c.adresse?.quartier || '',
    phone: c.contact?.telephone || '',
    email: c.contact?.email,
    contact: c.contact?.contact_principal,
    civilite: normalizeCivilite(c.civilite),
    secteur: c.secteuractivite || '',
    cnps: c.numerocnps,
    externalise: c.gestionexternalisee ? 'Oui' : 'Non',
    statut: c.statut === 'inactif' || c.statut === 'archive' ? 'Inactif' : 'Actif',
    statutImmo,
    loyerMensuel,
    loyerAnnuel: loyerMensuel ? loyerMensuel * 12 : 0,
    valeurBien,
    regimeFiscal: regime,
    chiffreAffaires: c.chiffreaffaires ?? 0,
    isCGA: !!c.iscga,
    isVendeurBoissons: !!c.isvendeurboissons,
    modePaiementIGS: c.modepaiementigs || 'annuel',
    modePaiementPSL: c.modepaiementpsl || 'annuel',
    createdAt: c.created_at || new Date().toISOString(),
  };

  // Compléter avec calculs
  const f = computeAllTaxes(partial);
  return {
    ...partial,
    igs: f.igs,
    igsClasse: f.igsClasse,
    patente: f.patente,
    tdl: f.tdl,
    soldeIR: f.soldeIR,
    licence: f.licence,
    psl: f.psl,
    bail: f.bail,
    tauxBail: f.tauxBail,
    tf: f.tf,
  };
}

// === Vérification fiche client complète (SPEC §4.6) ===
export const REQUIRED_CLIENT_FIELDS: Array<{ key: keyof ClientSpec; label: string }> = [
  { key: 'name', label: 'Nom / Raison sociale' },
  { key: 'type', label: 'Type' },
  { key: 'niu', label: 'NIU' },
  { key: 'ville', label: 'Ville' },
  { key: 'contact', label: 'Contact' },
  { key: 'regimeFiscal', label: 'Régime fiscal' },
];

export function getMissingClientFields(client: ClientSpec | null | undefined): string[] {
  if (!client) return REQUIRED_CLIENT_FIELDS.map((f) => f.label);
  return REQUIRED_CLIENT_FIELDS.filter((f) => {
    // La référence n'a qu'un champ « contact » : téléphone ou contact principal suffit.
    if (f.key === 'contact') return !client.contact && !client.phone;
    const v = client[f.key];
    return v === undefined || v === null || v === '';
  }).map((f) => f.label);
}
