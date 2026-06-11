// Types du format de sauvegarde « vanilla » (PRISMA GESTION, dossier facturation/).
//
// Référence : prisma-components.js — PrismaAutoBackup.performBackup() produit
// un fichier JSON `prisma-gestion-backup-YYYY-MM-DD_HHMM.json` de la forme :
//   { version: '2.0', exportDate, application: 'PRISMA GESTION',
//     clients: [...], factures: [...], recus: [...], devis: [...],
//     propositions: [...], notes: [...], cabinetConfig: {...}, ... }
// (une clé par entrée de PrismaBackup.ALL_DATA_KEYS si non vide).
//
// Les structures d'entités ci-dessous sont les formats internes localStorage
// construits par buildClientPayload() (clients.html), generateInvoice()
// (facture-app.html), generateRecu() (recu-app.html), saveDevis() (devis.html),
// saveProposal() (avance-app.html) et generateNote() (note-app.html).

export type VanillaType = 'Personne morale' | 'Personne physique';
export type VanillaRegime = 'IGS' | 'Reel' | 'NonPro' | 'OBNL';
export type VanillaCivilite = 'M.' | 'Mme';
export type VanillaStatutImmo = '' | 'Locataire' | 'Proprietaire' | 'Les deux';
export type VanillaPrestationType = 'Impôt' | 'Honoraire';
export type VanillaFactureStatus = 'émise' | 'payée' | 'partiellement_payée' | 'annulée';
export type VanillaDevisStatus = 'brouillon' | 'envoyé' | 'accepté' | 'refusé' | 'converti';
export type VanillaPaymentMode = 'Espèces' | 'Virement bancaire' | 'Mobile Money' | 'Chèque';

export interface VanillaAgence {
  libelle?: string;
  ville?: string;
  quartier?: string;
  principale?: boolean;
  chiffreAffaires?: number;
  statutImmo?: VanillaStatutImmo;
  loyerMensuel?: number;
  loyerAnnuel?: number;
  valeurBien?: number;
  psl?: number;
  bail?: number;
  tf?: number;
}

export interface VanillaClient {
  id?: number | string;
  createdAt?: string;
  type?: VanillaType;
  name?: string;
  niu?: string;
  cdi?: string;
  ville?: string;
  quartier?: string;
  phone?: string;
  email?: string;
  contact?: string;
  civilite?: VanillaCivilite | string;
  secteur?: string;
  cnps?: string;
  externalise?: 'Oui' | 'Non' | string;
  statut?: 'Actif' | 'Inactif' | string;
  agences?: VanillaAgence[];
  statutImmo?: VanillaStatutImmo;
  loyerMensuel?: number;
  loyerAnnuel?: number;
  valeurBien?: number;
  psl?: number;
  bail?: number;
  tauxBail?: number;
  tf?: number;
  regimeFiscal?: VanillaRegime | string;
  chiffreAffaires?: number;
  isCGA?: boolean;
  isVendeurBoissons?: boolean;
  modePaiementIGS?: 'annuel' | 'trimestriel' | string;
  modePaiementPSL?: 'annuel' | 'trimestriel' | string;
  igs?: number;
  igsClasse?: number;
  patente?: number;
  tdl?: number;
  soldeIR?: number;
  licence?: number;
}

export interface VanillaPrestation {
  type?: VanillaPrestationType | string;
  designation?: string;
  qty?: number;
  price?: number;
  total?: number;
}

export interface VanillaFacture {
  id?: number | string;
  number?: string; // « N° NNNN/YYYY/MM »
  client?: string; // nom du client
  clientData?: VanillaClient; // snapshot à l'émission
  prestations?: VanillaPrestation[];
  total?: number;
  totalImpots?: number;
  totalHonoraires?: number;
  date?: string; // ISO
  isManual?: boolean;
  status?: VanillaFactureStatus | string;
  fromDevis?: boolean;
  fromDevisId?: number | null;
  fromDevisNumber?: string | null;
}

export interface VanillaRecuLignePayee {
  type?: VanillaPrestationType | string;
  designation?: string;
  montant?: number;
}

export interface VanillaRecu {
  id?: number | string;
  number?: string; // « RECU-NNNN/YYYY »
  client?: string;
  montant?: number;
  montantImpots?: number;
  montantHonoraires?: number;
  paymentMode?: VanillaPaymentMode | string;
  motif?: string;
  lignesPayees?: VanillaRecuLignePayee[];
  date?: string;
  isManual?: boolean;
  factureIds?: Array<number | string>;
  factureNumbers?: string[];
  sourceType?: 'facture' | 'devis' | 'proposition' | null;
  sourceId?: number | string | null;
  sourceNumber?: string | null;
}

export interface VanillaDevis {
  id?: number | string;
  number?: string; // « DEVIS-NNNN/YYYY/MM »
  client?: string;
  clientData?: VanillaClient;
  prestations?: VanillaPrestation[];
  total?: number;
  totalImpots?: number;
  totalHonoraires?: number;
  date?: string;
  isManual?: boolean;
  status?: VanillaDevisStatus | string;
  convertedToFacture?: string;
  convertedToFactureId?: number | string;
  statusBeforeConversion?: string;
}

export interface VanillaPropositionLigne {
  type?: VanillaPrestationType | string;
  designation?: string;
  base?: number;
  fraction?: number;
  amount?: number;
}

export interface VanillaProposition {
  id?: number | string;
  client?: string;
  clientData?: VanillaClient;
  lignes?: VanillaPropositionLigne[];
  totalImpots?: number;
  totalHonoraires?: number;
  total?: number;
  note?: string;
  date?: string;
  isManual?: boolean;
  sourceType?: 'facture' | 'devis' | 'proposition' | null;
  sourceId?: number | string | null;
  sourceNumber?: string | null;
}

export interface VanillaNoteLigne {
  type?: VanillaPrestationType | string;
  designation?: string;
  montant?: number;
}

export interface VanillaNote {
  id?: number | string;
  number?: string; // « NH-NNNN/YYYY/MM »
  client?: string;
  clientContact?: string;
  clientCivilite?: VanillaCivilite | string;
  lignes?: VanillaNoteLigne[];
  totalImpots?: number;
  totalHonoraires?: number;
  totalGeneral?: number;
  date?: string;
  isManual?: boolean;
  factureId?: number | string | null;
  factureNumber?: string | null;
}

export interface VanillaCabinetConfig {
  nomCabinet?: string;
  slogan?: string;
  siege?: string;
  telephone?: string;
  niu?: string;
  signataireNom?: string;
  signataireTitre?: string;
  signature?: string; // data URL base64
  cachet?: string; // data URL base64
  [key: string]: unknown;
}

export interface VanillaBackup {
  version?: string;
  exportDate?: string;
  application?: string;
  clients?: VanillaClient[];
  clientsCorbeille?: VanillaClient[];
  factures?: VanillaFacture[];
  recus?: VanillaRecu[];
  devis?: VanillaDevis[];
  propositions?: VanillaProposition[];
  notes?: VanillaNote[];
  cabinetConfig?: VanillaCabinetConfig;
  // Autres clés ALL_DATA_KEYS (courriers, attestations, gestion*, missions…)
  // conservées telles quelles pour réexport sans perte.
  [key: string]: unknown;
}

/**
 * Analyse un fichier de sauvegarde vanilla.
 * Accepte :
 *  - l'objet de sauvegarde complet (PrismaAutoBackup, version 2.0) ;
 *  - un tableau « brut » de clients internes vanilla (export partiel).
 */
export function parseVanillaBackup(text: string): VanillaBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Fichier JSON invalide.');
  }

  if (Array.isArray(parsed)) {
    // Tableau de clients internes vanilla (heuristique : champs name/regimeFiscal/niu).
    const looksLikeClients = parsed.every(
      (item) => item && typeof item === 'object' &&
        ('name' in item || 'Nom' in item || 'niu' in item || 'NIU' in item),
    );
    if (!looksLikeClients) {
      throw new Error('Tableau JSON non reconnu : attendu une liste de clients PRISMA GESTION.');
    }
    return { clients: parsed as VanillaClient[] };
  }

  if (parsed && typeof parsed === 'object') {
    const backup = parsed as VanillaBackup;
    const hasKnownKey = ['clients', 'factures', 'recus', 'devis', 'propositions', 'notes', 'cabinetConfig']
      .some((k) => k in backup);
    if (!hasKnownKey) {
      throw new Error(
        "Sauvegarde non reconnue : aucune clé PRISMA GESTION (clients, factures, recus…) trouvée.",
      );
    }
    return backup;
  }

  throw new Error('Format de sauvegarde non reconnu.');
}

/* ===================================================================== */
/* MAPPERS IMPORT — vanilla → Prisma (Supabase)                          */
/* ===================================================================== */

import type { Client, Agence, RegimeFiscal, ClientType, ClientStatus, Civilite } from '@/types/client';
import type { Facture, Prestation } from '@/types/facture';
import type { Paiement } from '@/types/paiement';
import type { Devis } from '@/types/devis';
import type { Proposition, PropositionLigne } from '@/types/proposition';

const REGIME_FROM_VANILLA: Record<string, RegimeFiscal> = {
  IGS: 'igs',
  Reel: 'reel',
  NonPro: 'non_professionnel',
  OBNL: 'obnl',
};
const REGIME_TO_VANILLA: Record<RegimeFiscal, VanillaRegime> = {
  igs: 'IGS',
  reel: 'Reel',
  non_professionnel: 'NonPro',
  obnl: 'OBNL',
};

const STATUT_IMMO_FROM_VANILLA: Record<string, Agence['statutImmo']> = {
  Locataire: 'locataire',
  Proprietaire: 'proprietaire',
  'Les deux': 'les_deux',
};
const STATUT_IMMO_TO_VANILLA: Record<string, VanillaStatutImmo> = {
  locataire: 'Locataire',
  proprietaire: 'Proprietaire',
  les_deux: 'Les deux',
};

function normalizeCiviliteVanilla(value: unknown): Civilite {
  const v = String(value ?? '').trim().toLowerCase();
  if (['mme', 'mme.', 'madame', 'f', 'femme'].includes(v)) return 'Mme';
  return 'M.';
}

/** ISO (ou YYYY-MM-DD) → 'YYYY-MM-DD' pour les colonnes date Supabase. */
export function isoToDateOnly(value: string | undefined, fallback = new Date()): string {
  const d = value ? new Date(value) : fallback;
  if (Number.isNaN(d.getTime())) return fallback.toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

/** 'YYYY-MM-DD' → ISO ancré à 12:00 (règle vanilla anti-décalage UTC). */
export function dateOnlyToIso(value: string | undefined): string {
  if (!value) return new Date().toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00`).toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function addDaysDateOnly(dateOnly: string, days: number): string {
  const d = new Date(`${dateOnly}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function vanillaClientToClientPayload(vc: VanillaClient): Omit<Client, 'id' | 'created_at'> {
  const type: ClientType = vc.type === 'Personne morale' ? 'morale' : 'physique';
  const regimefiscal = REGIME_FROM_VANILLA[String(vc.regimeFiscal ?? '')] ?? 'reel';
  const statut: ClientStatus = String(vc.statut ?? 'Actif').toLowerCase() === 'inactif' ? 'inactif' : 'actif';
  const name = (vc.name ?? '').trim();

  const agences: Agence[] | undefined = vc.agences?.length
    ? vc.agences.map((a) => ({
        libelle: a.libelle ?? '',
        ville: a.ville ?? '',
        quartier: a.quartier ?? '',
        principale: !!a.principale,
        chiffreAffaires: a.chiffreAffaires ?? 0,
        statutImmo: STATUT_IMMO_FROM_VANILLA[String(a.statutImmo ?? '')] ?? '',
        loyerMensuel: a.loyerMensuel ?? 0,
        valeurBien: a.valeurBien ?? 0,
      }))
    : undefined;

  const situationimmobiliere = vc.statutImmo && STATUT_IMMO_FROM_VANILLA[vc.statutImmo]
    ? {
        type: STATUT_IMMO_FROM_VANILLA[vc.statutImmo] as 'locataire' | 'proprietaire' | 'les_deux',
        valeur: vc.valeurBien ?? 0,
        loyer: vc.loyerMensuel ?? 0,
      }
    : undefined;

  return {
    type,
    nom: type === 'physique' ? name : undefined,
    raisonsociale: type === 'morale' ? name : undefined,
    regimefiscal,
    niu: vc.niu ?? '',
    centrerattachement: vc.cdi ?? '',
    adresse: { ville: vc.ville ?? '', quartier: vc.quartier ?? '', lieuDit: '' },
    contact: {
      telephone: vc.phone ?? '',
      email: vc.email ?? '',
      contact_principal: vc.contact || undefined,
    },
    secteuractivite: vc.secteur ?? '',
    numerocnps: vc.cnps || undefined,
    interactions: [],
    statut,
    gestionexternalisee: String(vc.externalise ?? 'Non') === 'Oui',
    civilite: normalizeCiviliteVanilla(vc.civilite),
    chiffreaffaires: vc.chiffreAffaires ?? undefined,
    iscga: vc.isCGA ?? undefined,
    isvendeurboissons: vc.isVendeurBoissons ?? undefined,
    modepaiementigs: vc.modePaiementIGS === 'trimestriel' ? 'trimestriel' : 'annuel',
    modepaiementpsl: vc.modePaiementPSL === 'trimestriel' ? 'trimestriel' : 'annuel',
    situationimmobiliere,
    agences,
    datecreation: vc.createdAt || undefined,
  };
}

export interface FactureInsertRow {
  id: string;
  client_id: string;
  date: string;
  echeance: string;
  montant: number;
  status: 'brouillon' | 'envoyée' | 'annulée';
  status_paiement: 'non_payée' | 'partiellement_payée' | 'payée' | 'en_retard';
  notes: string | null;
}

export interface FacturePrestationRow {
  description: string;
  type: 'impot' | 'honoraire';
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export function vanillaFactureToInsert(
  vf: VanillaFacture,
  clientId: string,
): { facture: FactureInsertRow; prestations: FacturePrestationRow[] } {
  const dateOnly = isoToDateOnly(vf.date);
  const status = String(vf.status ?? 'émise');
  // « Échéance : 30 jours à compter de la date d'émission » (référence facture).
  const echeance = addDaysDateOnly(dateOnly, 30);

  let statusDoc: FactureInsertRow['status'] = 'envoyée';
  let statusPaiement: FactureInsertRow['status_paiement'] = 'non_payée';
  if (status === 'annulée') statusDoc = 'annulée';
  else if (status === 'payée') statusPaiement = 'payée';
  else if (status === 'partiellement_payée') statusPaiement = 'partiellement_payée';

  const prestations: FacturePrestationRow[] = (vf.prestations ?? []).map((p) => {
    const quantite = p.qty ?? 1;
    const prix = p.price ?? 0;
    return {
      description: p.designation ?? 'Prestation',
      type: p.type === 'Impôt' ? 'impot' : 'honoraire',
      quantite,
      prix_unitaire: prix,
      montant: p.total ?? quantite * prix,
    };
  });

  const montant = vf.total ?? prestations.reduce((s, p) => s + p.montant, 0);

  return {
    facture: {
      // L'id Supabase d'une facture EST son numéro (cf. factureCreationService).
      id: vf.number || `N° ${String(vf.id ?? '').slice(-4)}`,
      client_id: clientId,
      date: dateOnly,
      echeance,
      montant,
      status: statusDoc,
      status_paiement: statusPaiement,
      notes: vf.fromDevisNumber ? `Converti depuis ${vf.fromDevisNumber}` : null,
    },
    prestations,
  };
}

const MODE_FROM_VANILLA: Record<string, Paiement['mode']> = {
  'Espèces': 'espèces',
  'Virement bancaire': 'virement',
  'Mobile Money': 'orange_money',
  'Chèque': 'cheque',
};
const MODE_TO_VANILLA: Record<string, VanillaPaymentMode> = {
  'espèces': 'Espèces',
  especes: 'Espèces',
  virement: 'Virement bancaire',
  orange_money: 'Mobile Money',
  mtn_money: 'Mobile Money',
  mobile_money: 'Mobile Money',
  cheque: 'Chèque',
  'chèque': 'Chèque',
};

export interface PaiementInsertRow {
  client_id: string;
  facture_id: string | null;
  date: string;
  montant: number;
  mode: string;
  reference: string;
  est_credit: boolean;
  est_verifie: boolean;
  solde_restant: number;
  notes: string | null;
}

export function vanillaRecuToPaiementInsert(
  vr: VanillaRecu,
  clientId: string,
  factureId: string | null,
): PaiementInsertRow {
  return {
    client_id: clientId,
    facture_id: factureId,
    date: isoToDateOnly(vr.date),
    montant: vr.montant ?? 0,
    mode: MODE_FROM_VANILLA[String(vr.paymentMode ?? '')] ?? 'espèces',
    reference: vr.number || `RECU-IMP-${String(vr.id ?? '')}`,
    // Sans facture rattachée, le paiement est enregistré comme avance/crédit.
    est_credit: factureId === null,
    est_verifie: true,
    solde_restant: 0,
    notes: vr.motif || null,
  };
}

export interface DevisInsertRow {
  id: string;
  numero: string;
  client_id: string;
  date: string;
  date_validite: string;
  objet: string | null;
  status: string;
  montant_total: number;
  notes: string | null;
  facture_id: string | null;
}

export interface DevisPrestationRow {
  description: string;
  type: 'impot' | 'honoraire';
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

const DEVIS_STATUS_FROM_VANILLA: Record<string, string> = {
  brouillon: 'brouillon',
  'envoyé': 'envoye',
  'accepté': 'accepte',
  'refusé': 'refuse',
  converti: 'converti',
};
const DEVIS_STATUS_TO_VANILLA: Record<string, VanillaDevisStatus> = {
  brouillon: 'brouillon',
  envoye: 'envoyé',
  accepte: 'accepté',
  refuse: 'refusé',
  converti: 'converti',
};

export function vanillaDevisToInsert(
  vd: VanillaDevis,
  clientId: string,
  id: string,
): { devis: DevisInsertRow; prestations: DevisPrestationRow[] } {
  const dateOnly = isoToDateOnly(vd.date);
  const prestations: DevisPrestationRow[] = (vd.prestations ?? []).map((p) => {
    const quantite = p.qty ?? 1;
    const prix = p.price ?? 0;
    return {
      description: p.designation ?? 'Prestation',
      type: p.type === 'Impôt' ? 'impot' : 'honoraire',
      quantite,
      prix_unitaire: prix,
      montant: p.total ?? quantite * prix,
    };
  });
  return {
    devis: {
      id,
      numero: vd.number || `DEVIS-IMP-${String(vd.id ?? '')}`,
      client_id: clientId,
      date: dateOnly,
      // « Ce devis est valable 30 jours à compter de sa date d'émission ».
      date_validite: addDaysDateOnly(dateOnly, 30),
      objet: null,
      status: DEVIS_STATUS_FROM_VANILLA[String(vd.status ?? 'brouillon')] ?? 'brouillon',
      montant_total: vd.total ?? prestations.reduce((s, p) => s + p.montant, 0),
      notes: null,
      facture_id: vd.convertedToFacture || null,
    },
    prestations,
  };
}

export interface PropositionInsertRow {
  id: string;
  numero: string;
  client_id: string;
  date: string;
  date_manuelle: boolean;
  source_type: 'devis' | 'facture' | null;
  source_id: string | null;
  source_numero: string | null;
  lignes: PropositionLigne[];
  total: number;
  total_impots: number;
  total_honoraires: number;
  status: string;
  notes: string | null;
}

export function vanillaPropositionToInsert(
  vp: VanillaProposition,
  clientId: string,
  id: string,
  numero: string,
): PropositionInsertRow {
  const lignes: PropositionLigne[] = (vp.lignes ?? []).map((l) => ({
    type: l.type === 'Impôt' ? 'impot' : 'honoraire',
    designation: l.designation ?? '',
    base_annuelle: l.base ?? 0,
    fraction: l.fraction ?? 0,
    montant: l.amount ?? 0,
  }));
  const totalImpots = vp.totalImpots ?? lignes.filter((l) => l.type === 'impot').reduce((s, l) => s + l.montant, 0);
  const totalHonoraires = vp.totalHonoraires ?? lignes.filter((l) => l.type === 'honoraire').reduce((s, l) => s + l.montant, 0);
  return {
    id,
    numero,
    client_id: clientId,
    date: isoToDateOnly(vp.date),
    date_manuelle: !!vp.isManual,
    source_type: vp.sourceType === 'devis' || vp.sourceType === 'facture' ? vp.sourceType : null,
    source_id: vp.sourceId != null ? String(vp.sourceId) : null,
    source_numero: vp.sourceNumber ?? null,
    lignes,
    total: vp.total ?? totalImpots + totalHonoraires,
    total_impots: totalImpots,
    total_honoraires: totalHonoraires,
    status: 'brouillon',
    notes: vp.note || null,
  };
}

/* ===================================================================== */
/* MAPPERS EXPORT — Prisma → vanilla                                     */
/* ===================================================================== */

export function clientToVanillaClient(c: Client, numericId: number): VanillaClient {
  const situ = c.situationimmobiliere;
  const loyerMensuel = situ?.loyer ?? 0;
  return {
    id: numericId,
    createdAt: c.created_at || c.datecreation || new Date().toISOString(),
    type: c.type === 'morale' ? 'Personne morale' : 'Personne physique',
    name: (c.type === 'morale' ? c.raisonsociale : c.nom) || c.nom || c.raisonsociale || '',
    niu: c.niu || '',
    cdi: c.centrerattachement || '',
    ville: c.adresse?.ville || '',
    quartier: c.adresse?.quartier || '',
    phone: c.contact?.telephone || '',
    email: c.contact?.email || '',
    contact: c.contact?.contact_principal || c.contact?.telephone || '',
    civilite: c.civilite === 'Mme' ? 'Mme' : 'M.',
    secteur: c.secteuractivite || '',
    cnps: c.numerocnps || '',
    externalise: c.gestionexternalisee ? 'Oui' : 'Non',
    statut: c.statut === 'inactif' ? 'Inactif' : 'Actif',
    regimeFiscal: REGIME_TO_VANILLA[c.regimefiscal] ?? 'Reel',
    chiffreAffaires: c.chiffreaffaires ?? 0,
    isCGA: !!c.iscga,
    isVendeurBoissons: !!c.isvendeurboissons,
    modePaiementIGS: c.modepaiementigs === 'trimestriel' ? 'trimestriel' : 'annuel',
    modePaiementPSL: c.modepaiementpsl === 'trimestriel' ? 'trimestriel' : 'annuel',
    statutImmo: situ?.type ? STATUT_IMMO_TO_VANILLA[situ.type] ?? '' : '',
    loyerMensuel,
    loyerAnnuel: loyerMensuel * 12,
    valeurBien: situ?.valeur ?? 0,
    agences: c.agences?.length
      ? c.agences.map((a) => ({
          libelle: a.libelle,
          ville: a.ville,
          quartier: a.quartier,
          principale: a.principale,
          chiffreAffaires: a.chiffreAffaires,
          statutImmo: a.statutImmo ? STATUT_IMMO_TO_VANILLA[a.statutImmo] ?? '' : '',
          loyerMensuel: a.loyerMensuel,
          loyerAnnuel: (a.loyerMensuel || 0) * 12,
          valeurBien: a.valeurBien,
        }))
      : undefined,
  };
}

function prestationToVanilla(p: Prestation): VanillaPrestation {
  return {
    type: p.type === 'impot' ? 'Impôt' : 'Honoraire',
    designation: p.description,
    qty: p.quantite || 1,
    price: p.prix_unitaire || 0,
    total: p.montant ?? (p.quantite || 1) * (p.prix_unitaire || 0),
  };
}

export function factureToVanillaFacture(
  f: Facture,
  vanillaClient: VanillaClient,
  numericId: number,
): VanillaFacture {
  const prestations = (f.prestations ?? []).map(prestationToVanilla);
  const totalImpots = f.montant_impots ??
    prestations.filter((p) => p.type === 'Impôt').reduce((s, p) => s + (p.total ?? 0), 0);
  const totalHonoraires = f.montant_honoraires ??
    prestations.filter((p) => p.type === 'Honoraire').reduce((s, p) => s + (p.total ?? 0), 0);

  let status: VanillaFactureStatus = 'émise';
  if (f.status === 'annulée') status = 'annulée';
  else if (f.status_paiement === 'payée') status = 'payée';
  else if (f.status_paiement === 'partiellement_payée') status = 'partiellement_payée';

  return {
    id: numericId,
    number: f.numero || f.id,
    client: vanillaClient.name,
    clientData: vanillaClient,
    prestations,
    total: f.montant ?? totalImpots + totalHonoraires,
    totalImpots,
    totalHonoraires,
    date: dateOnlyToIso(f.date),
    isManual: false,
    status,
    fromDevis: !!f.devis_id,
    fromDevisId: null,
    fromDevisNumber: f.devis_id || null,
  };
}

export function paiementToVanillaRecu(
  p: Paiement,
  clientName: string,
  numericId: number,
  opts: {
    montantImpots: number;
    montantHonoraires: number;
    factureNumericId?: number;
    factureNumber?: string;
  },
): VanillaRecu {
  return {
    id: numericId,
    number: p.reference || `RECU-${String(p.id ?? '').slice(-6)}`,
    client: clientName,
    montant: Number(p.montant) || 0,
    montantImpots: opts.montantImpots,
    montantHonoraires: opts.montantHonoraires,
    paymentMode: MODE_TO_VANILLA[String(p.mode ?? '')] ?? 'Mobile Money',
    motif: p.notes || (opts.factureNumber ? `Règlement facture ${opts.factureNumber}` : 'Paiement client'),
    date: dateOnlyToIso(p.date),
    isManual: false,
    factureIds: opts.factureNumericId != null ? [opts.factureNumericId] : [],
    factureNumbers: opts.factureNumber ? [opts.factureNumber] : [],
    sourceType: opts.factureNumber ? 'facture' : null,
    sourceId: opts.factureNumericId ?? null,
    sourceNumber: opts.factureNumber ?? null,
  };
}

export function devisToVanillaDevis(
  d: Devis,
  vanillaClient: VanillaClient,
  numericId: number,
): VanillaDevis {
  const prestations = (d.prestations ?? []).map((p) => ({
    type: p.type === 'impot' ? ('Impôt' as const) : ('Honoraire' as const),
    designation: p.description,
    qty: p.quantite || 1,
    price: p.prix_unitaire || 0,
    total: p.montant ?? (p.quantite || 1) * (p.prix_unitaire || 0),
  }));
  return {
    id: numericId,
    number: d.numero,
    client: vanillaClient.name,
    clientData: vanillaClient,
    prestations,
    total: d.montant_total ?? prestations.reduce((s, p) => s + (p.total ?? 0), 0),
    totalImpots: d.montant_impots ?? prestations.filter((p) => p.type === 'Impôt').reduce((s, p) => s + (p.total ?? 0), 0),
    totalHonoraires: d.montant_honoraires ?? prestations.filter((p) => p.type === 'Honoraire').reduce((s, p) => s + (p.total ?? 0), 0),
    date: dateOnlyToIso(d.date),
    isManual: false,
    status: DEVIS_STATUS_TO_VANILLA[d.status] ?? 'brouillon',
    convertedToFacture: d.facture_id || undefined,
  };
}

export function propositionToVanillaProposition(
  p: Proposition,
  vanillaClient: VanillaClient,
  numericId: number,
): VanillaProposition {
  const lignes = (p.lignes ?? []).map((l) => ({
    type: l.type === 'impot' ? ('Impôt' as const) : ('Honoraire' as const),
    designation: l.designation,
    base: l.base_annuelle || 0,
    fraction: l.fraction || 0,
    amount: l.montant || 0,
  }));
  return {
    id: numericId,
    client: vanillaClient.name,
    clientData: vanillaClient,
    lignes,
    totalImpots: p.total_impots ?? lignes.filter((l) => l.type === 'Impôt').reduce((s, l) => s + l.amount, 0),
    totalHonoraires: p.total_honoraires ?? lignes.filter((l) => l.type === 'Honoraire').reduce((s, l) => s + l.amount, 0),
    total: p.total ?? 0,
    note: p.notes || undefined,
    date: dateOnlyToIso(p.date),
    isManual: !!p.date_manuelle,
    sourceType: p.source_type ?? null,
    sourceId: null,
    sourceNumber: p.source_numero ?? null,
  };
}

/** Assemble l'objet de sauvegarde au format PrismaAutoBackup (version 2.0). */
export function buildVanillaBackup(parts: {
  clients?: VanillaClient[];
  factures?: VanillaFacture[];
  recus?: VanillaRecu[];
  devis?: VanillaDevis[];
  propositions?: VanillaProposition[];
  notes?: VanillaNote[];
  cabinetConfig?: VanillaCabinetConfig;
}): VanillaBackup {
  const backup: VanillaBackup = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    application: 'PRISMA GESTION',
  };
  if (parts.clients?.length) backup.clients = parts.clients;
  if (parts.factures?.length) backup.factures = parts.factures;
  if (parts.recus?.length) backup.recus = parts.recus;
  if (parts.devis?.length) backup.devis = parts.devis;
  if (parts.propositions?.length) backup.propositions = parts.propositions;
  if (parts.notes?.length) backup.notes = parts.notes;
  if (parts.cabinetConfig && Object.keys(parts.cabinetConfig).length) {
    backup.cabinetConfig = parts.cabinetConfig;
  }
  return backup;
}

/** Nom de fichier identique au vanilla : prisma-gestion-backup-YYYY-MM-DD_HHMM.json */
export function vanillaBackupFilename(date: Date = new Date()): string {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
  return `prisma-gestion-backup-${dateStr}_${timeStr}.json`;
}
