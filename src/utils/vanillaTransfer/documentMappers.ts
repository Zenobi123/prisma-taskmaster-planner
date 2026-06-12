// Conversion bidirectionnelle des documents d'historique entre le modèle
// vanilla (localStorage) et les tables Supabase de PRISMA GESTION.
//
// Correspondances :
//   factures      ↔ factures + facture_prestations (id = numéro « N° NNNN/YYYY/MM »)
//   devis         ↔ devis + devis_prestations
//   recus         ↔ paiements (reference = « RECU-NNNN/YYYY »)
//   propositions  ↔ propositions (lignes en JSON)
//   courriers     ↔ courriers
//   notes/contrats : pas d'équivalent Supabase — signalés non importés.

import { stableNumericId } from "./clientMapper";
import {
  VanillaClient,
  VanillaCourrier,
  VanillaDevis,
  VanillaFacture,
  VanillaLignePayee,
  VanillaPrestation,
  VanillaProposition,
  VanillaPropositionLigne,
  VanillaRecu,
} from "./types";

const norm = (s: string | undefined | null): string =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

const toDateOnly = (iso: string | undefined): string => {
  const d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

const addDays = (iso: string | undefined, days: number): string => {
  const d = iso ? new Date(iso) : new Date();
  const base = isNaN(d.getTime()) ? new Date() : d;
  const c = new Date(base);
  c.setDate(c.getDate() + days);
  return c.toISOString().slice(0, 10);
};

// === Prestations ===

export type PrismaPrestationType = "impot" | "honoraire";

export interface PrestationRowLike {
  description: string;
  type: string | null;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export function vanillaPrestationType(type: string | undefined): PrismaPrestationType {
  return norm(type).startsWith("imp") ? "impot" : "honoraire";
}

export function prestationVanillaToRow(p: VanillaPrestation): PrestationRowLike {
  const qty = Number(p.qty) || 1;
  const price = Number(p.price) || 0;
  return {
    description: p.designation || "",
    type: vanillaPrestationType(p.type),
    quantite: qty,
    prix_unitaire: price,
    montant: Number(p.total) || qty * price,
  };
}

export function prestationRowToVanilla(p: PrestationRowLike): VanillaPrestation {
  return {
    type: p.type === "impot" ? "Impôt" : "Honoraire",
    designation: p.description,
    qty: p.quantite || 1,
    price: p.prix_unitaire || 0,
    total: p.montant || 0,
  };
}

export function sumByType(prestations: VanillaPrestation[]): {
  total: number;
  totalImpots: number;
  totalHonoraires: number;
} {
  const totalImpots = prestations
    .filter((p) => norm(p.type).startsWith("imp"))
    .reduce((s, p) => s + (Number(p.total) || 0), 0);
  const totalHonoraires = prestations
    .filter((p) => !norm(p.type).startsWith("imp"))
    .reduce((s, p) => s + (Number(p.total) || 0), 0);
  return { total: totalImpots + totalHonoraires, totalImpots, totalHonoraires };
}

// === Factures ===

export interface FactureRowInsert {
  id: string;
  client_id: string;
  date: string;
  echeance: string;
  montant: number;
  montant_paye: number;
  status: string;
  status_paiement: string;
  mode_paiement: string;
  notes: string | null;
}

export function vanillaFactureToRow(f: VanillaFacture, clientId: string): FactureRowInsert {
  const statut = norm(f.status);
  const montant = Number(f.total) || 0;
  // Les reçus importés recalculent ensuite montant_paye / status_paiement ;
  // le statut vanilla sert d'état initial pour les factures sans reçu lié.
  const statusPaiement =
    statut === "payee" ? "payée" : statut === "partielle" ? "partiellement_payée" : "non_payée";
  return {
    id: f.number || `N° ${String(f.id || Date.now()).slice(-4)}`,
    client_id: clientId,
    date: toDateOnly(f.date),
    echeance: f.echeance ? toDateOnly(f.echeance) : addDays(f.date, 30),
    montant,
    montant_paye: statusPaiement === "payée" ? montant : 0,
    status: statut === "brouillon" ? "brouillon" : statut === "annulee" ? "annulée" : "envoyée",
    status_paiement: statusPaiement,
    mode_paiement: f.modePaiementPrisma || "espèces",
    notes: f.notes ?? null,
  };
}

export interface FactureRowLike {
  id: string;
  date: string;
  echeance?: string | null;
  montant: number | null;
  montant_paye: number | null;
  status: string;
  status_paiement: string;
  mode_paiement?: string | null;
  notes?: string | null;
}

export function factureRowToVanilla(
  row: FactureRowLike,
  prestations: PrestationRowLike[],
  client: VanillaClient,
  devisSource?: { id: string; numero: string } | null,
): VanillaFacture {
  const lignes = prestations.map(prestationRowToVanilla);
  const totals = sumByType(lignes);
  const statut =
    row.status_paiement === "payée"
      ? "payée"
      : row.status_paiement === "partiellement_payée"
        ? "partielle"
        : "émise";
  return {
    id: stableNumericId(row.id),
    number: row.id,
    client: client.name,
    clientData: client,
    prestations: lignes,
    total: Number(row.montant) || totals.total,
    totalImpots: totals.totalImpots,
    totalHonoraires: totals.totalHonoraires,
    date: row.date,
    isManual: false,
    status: statut,
    ...(devisSource
      ? {
          fromDevis: true,
          fromDevisId: stableNumericId(devisSource.id),
          fromDevisNumber: devisSource.numero,
        }
      : {}),
    // Passage PRISMA → fidélité de l'aller-retour
    ...(row.echeance ? { echeance: row.echeance } : {}),
    ...(row.mode_paiement ? { modePaiementPrisma: row.mode_paiement } : {}),
    ...(row.notes ? { notes: row.notes } : {}),
  };
}

// === Devis ===

const DEVIS_STATUS_TO_PRISMA: Record<string, string> = {
  brouillon: "brouillon",
  envoye: "envoye",
  accepte: "accepte",
  refuse: "refuse",
  converti: "converti",
};

const DEVIS_STATUS_TO_VANILLA: Record<string, string> = {
  brouillon: "brouillon",
  envoye: "envoyé",
  accepte: "accepté",
  refuse: "refusé",
  converti: "converti",
};

export interface DevisRowInsert {
  id: string;
  numero: string;
  client_id: string;
  date: string;
  date_validite: string | null;
  objet: string | null;
  status: string;
  montant_total: number;
  notes: string | null;
  facture_id: string | null;
}

export function vanillaDevisToRow(
  d: VanillaDevis,
  clientId: string,
  factureIdIfExists: string | null,
): DevisRowInsert {
  return {
    id: `DEV-${crypto.randomUUID()}`,
    numero: d.number || `DEVIS-${String(d.id || Date.now()).slice(-4)}`,
    client_id: clientId,
    date: toDateOnly(d.date),
    date_validite: d.dateValidite ? toDateOnly(d.dateValidite) : addDays(d.date, 30),
    objet: d.objet ?? null,
    status: DEVIS_STATUS_TO_PRISMA[norm(d.status)] ?? "brouillon",
    montant_total: Number(d.total) || 0,
    notes: d.notes ?? null,
    facture_id: factureIdIfExists,
  };
}

export interface DevisRowLike {
  id: string;
  numero: string;
  date: string;
  date_validite?: string | null;
  objet?: string | null;
  status: string;
  montant_total: number | null;
  notes?: string | null;
  facture_id: string | null;
}

export function devisRowToVanilla(
  row: DevisRowLike,
  prestations: PrestationRowLike[],
  client: VanillaClient,
): VanillaDevis {
  const lignes = prestations.map(prestationRowToVanilla);
  const totals = sumByType(lignes);
  const status = DEVIS_STATUS_TO_VANILLA[norm(row.status)] ?? row.status;
  return {
    id: stableNumericId(row.id),
    number: row.numero,
    client: client.name,
    clientData: client,
    prestations: lignes,
    total: Number(row.montant_total) || totals.total,
    totalImpots: totals.totalImpots,
    totalHonoraires: totals.totalHonoraires,
    date: row.date,
    isManual: false,
    status,
    ...(row.facture_id
      ? {
          statusBeforeConversion: "accepté",
          convertedToFacture: row.facture_id,
          convertedToFactureId: stableNumericId(row.facture_id),
        }
      : {}),
    // Passage PRISMA → fidélité de l'aller-retour
    ...(row.objet ? { objet: row.objet } : {}),
    ...(row.notes ? { notes: row.notes } : {}),
    ...(row.date_validite ? { dateValidite: row.date_validite } : {}),
  };
}

// === Reçus ↔ paiements ===

const PAYMENT_MODE_TO_PRISMA: Record<string, string> = {
  especes: "espèces",
  "virement bancaire": "virement",
  virement: "virement",
  "mobile money": "orange_money",
  "orange money": "orange_money",
  "mtn money": "mtn_money",
  cheque: "cheque",
};

const PAYMENT_MODE_TO_VANILLA: Record<string, string> = {
  "espèces": "Espèces",
  especes: "Espèces",
  virement: "Virement bancaire",
  orange_money: "Mobile Money",
  mtn_money: "Mobile Money",
  cheque: "Chèque",
};

export interface PaiementRowInsert {
  client_id: string;
  facture_id: string | null;
  date: string;
  montant: number;
  mode: string;
  est_credit: boolean;
  est_verifie: boolean;
  reference: string;
  notes: string | null;
  solde_restant: number | null;
  elements_specifiques: Record<string, unknown>;
}

export function vanillaRecuToPaiementRow(
  r: VanillaRecu,
  clientId: string,
  factureIdIfExists: string | null,
  factureMontant: number | null,
): PaiementRowInsert {
  const montant = Number(r.montant) || 0;
  return {
    client_id: clientId,
    facture_id: factureIdIfExists,
    date: r.date || new Date().toISOString(),
    montant,
    mode: PAYMENT_MODE_TO_PRISMA[norm(r.paymentMode)] ?? "espèces",
    est_credit: !factureIdIfExists,
    est_verifie: r.estVerifie ?? true,
    reference: r.number || `RECU-IMP-${r.id || Date.now()}`,
    notes: r.notes ?? (r.motif || null),
    solde_restant:
      factureMontant !== null ? Math.max(0, factureMontant - montant) : null,
    elements_specifiques: {
      source: "vanilla-import",
      vanillaId: r.id ?? null,
      montantImpots: Number(r.montantImpots) || 0,
      montantHonoraires: Number(r.montantHonoraires) || 0,
      lignesPayees: Array.isArray(r.lignesPayees) ? r.lignesPayees : [],
    },
  };
}

export interface PaiementRowLike {
  id: string;
  facture_id: string | null;
  date: string;
  montant: number;
  mode: string;
  reference: string | null;
  notes: string | null;
  est_credit: boolean | null;
  est_verifie?: boolean | null;
  elements_specifiques: unknown;
}

/** Ventilation Impôts / Honoraires au prorata de la composition de la facture. */
function ventilerMontant(
  montant: number,
  prestations: PrestationRowLike[],
): { montantImpots: number; montantHonoraires: number } {
  const impots = prestations
    .filter((p) => p.type === "impot")
    .reduce((s, p) => s + (p.montant || 0), 0);
  const honoraires = prestations
    .filter((p) => p.type !== "impot")
    .reduce((s, p) => s + (p.montant || 0), 0);
  const total = impots + honoraires;
  if (total <= 0) return { montantImpots: 0, montantHonoraires: 0 };
  const ratio = Math.min(1, montant / total);
  return {
    montantImpots: Math.round(impots * ratio),
    montantHonoraires: Math.round(honoraires * ratio),
  };
}

export function paiementRowToVanillaRecu(
  row: PaiementRowLike,
  client: VanillaClient,
  facture: { id: string; montant: number | null } | null,
  facturePrestations: PrestationRowLike[],
): VanillaRecu {
  const montant = Number(row.montant) || 0;
  const { montantImpots, montantHonoraires } = ventilerMontant(montant, facturePrestations);

  // Paiement total : toutes les lignes de la facture sont considérées payées.
  const isTotal = facture && montant >= (Number(facture.montant) || 0);
  const lignesPayees: VanillaLignePayee[] = isTotal
    ? facturePrestations.map((p) => ({
        type: p.type === "impot" ? "Impôt" : "Honoraire",
        designation: p.description,
        montant: p.montant || 0,
      }))
    : [];

  return {
    id: stableNumericId(row.id),
    number: row.reference || `RECU-${row.id.slice(-6)}`,
    client: client.name,
    montant,
    montantImpots,
    montantHonoraires,
    paymentMode: PAYMENT_MODE_TO_VANILLA[norm(row.mode)] ?? "Espèces",
    motif: facture
      ? `Règlement facture ${facture.id}`
      : row.est_credit
        ? "Avance / crédit client"
        : row.notes || "Paiement client",
    lignesPayees,
    date: row.date,
    isManual: false,
    ...(facture
      ? {
          factureIds: [stableNumericId(facture.id)],
          factureNumbers: [facture.id],
          sourceType: "facture",
          sourceId: stableNumericId(facture.id),
          sourceNumber: facture.id,
        }
      : {}),
    // Passage PRISMA → fidélité de l'aller-retour
    ...(row.notes ? { notes: row.notes } : {}),
    ...(row.est_verifie === false ? { estVerifie: false } : {}),
  };
}

// === Propositions ===

export interface PropositionRowInsert {
  id: string;
  numero: string;
  client_id: string;
  date: string;
  date_manuelle: boolean;
  source_type: string | null;
  source_id: string | null;
  source_numero: string | null;
  lignes: Array<Record<string, unknown>>;
  total: number;
  total_impots: number;
  total_honoraires: number;
  status: string;
  notes: string | null;
}

function vanillaLigneToPrisma(l: VanillaPropositionLigne): Record<string, unknown> {
  return {
    type: vanillaPrestationType(l.type),
    designation: l.designation || "",
    base_annuelle: Number(l.base ?? l.base_annuelle) || 0,
    fraction: Number(l.fraction) || 0,
    montant: Number(l.amount ?? l.montant) || 0,
  };
}

export function vanillaPropositionToRow(
  p: VanillaProposition,
  clientId: string,
): PropositionRowInsert {
  const lignes = (p.lignes || []).map(vanillaLigneToPrisma);
  const totalImpots =
    Number(p.totalImpots) ||
    lignes.filter((l) => l.type === "impot").reduce((s, l) => s + (Number(l.montant) || 0), 0);
  const totalHonoraires =
    Number(p.totalHonoraires) ||
    lignes.filter((l) => l.type !== "impot").reduce((s, l) => s + (Number(l.montant) || 0), 0);
  return {
    id: `PROP-${crypto.randomUUID()}`,
    // Numéro déterministe dérivé de l'id vanilla : réimport idempotent.
    numero: p.number || `PROP-IMP-${p.id || Date.now()}`,
    client_id: clientId,
    date: toDateOnly(p.date),
    date_manuelle: !!p.isManual,
    source_type: p.sourceType === "devis" || p.sourceType === "facture" ? p.sourceType : null,
    source_id: null,
    source_numero: p.sourceNumber || null,
    lignes,
    total: Number(p.total) || totalImpots + totalHonoraires,
    total_impots: totalImpots,
    total_honoraires: totalHonoraires,
    status: PROPOSITION_STATUSES.has(norm(p.statusPrisma)) ? norm(p.statusPrisma) : "brouillon",
    notes: p.note || null,
  };
}

const PROPOSITION_STATUSES: ReadonlySet<string> = new Set(["brouillon", "envoyee", "acceptee"]);

export interface PropositionRowLike {
  id: string;
  numero: string;
  date: string;
  date_manuelle: boolean | null;
  source_type: string | null;
  source_numero: string | null;
  lignes: unknown;
  total: number | null;
  total_impots: number | null;
  total_honoraires: number | null;
  status?: string | null;
  notes: string | null;
}

export function propositionRowToVanilla(
  row: PropositionRowLike,
  client: VanillaClient,
): VanillaProposition {
  const lignesRaw = Array.isArray(row.lignes) ? (row.lignes as Array<Record<string, unknown>>) : [];
  const lignes: VanillaPropositionLigne[] = lignesRaw.map((l) => ({
    type: l.type === "impot" ? "Impôt" : "Honoraire",
    designation: String(l.designation || ""),
    base: Number(l.base_annuelle) || 0,
    fraction: Number(l.fraction) || 0,
    amount: Number(l.montant) || 0,
  }));
  return {
    id: stableNumericId(row.id),
    number: row.numero,
    client: client.name,
    clientData: client,
    lignes,
    totalImpots: Number(row.total_impots) || 0,
    totalHonoraires: Number(row.total_honoraires) || 0,
    total: Number(row.total) || 0,
    note: row.notes || "",
    date: row.date,
    isManual: !!row.date_manuelle,
    sourceType: row.source_type,
    sourceId: null,
    sourceNumber: row.source_numero,
    ...(row.status ? { statusPrisma: row.status } : {}),
  };
}

// === Courriers ===

const COURRIER_STATUT_NORM: Record<string, string> = {
  brouillon: "brouillon",
  envoye: "envoye",
  accuse: "accuse",
  classe: "classe",
};

export interface CourrierRowInsert {
  reference: string;
  client_id: string | null;
  client_nom: string | null;
  template_id: string | null;
  template_titre: string | null;
  sujet: string | null;
  contenu: string | null;
  message_personnalise: string | null;
  statut: string;
  mode_envoi: string | null;
  date_creation: string;
  date_envoi: string | null;
}

export function vanillaCourrierToRow(
  c: VanillaCourrier,
  clientId: string | null,
): CourrierRowInsert {
  return {
    reference: c.ref || `CRR-IMP-${c.id || Date.now()}`,
    client_id: clientId,
    client_nom: c.client || c.destinataire || null,
    template_id: c.modeleKey || null,
    template_titre: c.templateTitre || null,
    sujet: c.objet || null,
    contenu: c.corps || null,
    message_personnalise: c.messagePersonnalise || null,
    statut: COURRIER_STATUT_NORM[norm(c.statut)] ?? "brouillon",
    mode_envoi: c.modeEnvoi || null,
    date_creation: c.date || new Date().toISOString(),
    date_envoi: c.dateEnvoi || null,
  };
}

export interface CourrierRowLike {
  id: string;
  reference: string;
  client_nom: string | null;
  template_id: string | null;
  template_titre?: string | null;
  sujet: string | null;
  contenu: string | null;
  message_personnalise: string | null;
  statut: string;
  mode_envoi: string | null;
  date_creation: string;
  date_envoi: string | null;
}

export function courrierRowToVanilla(
  row: CourrierRowLike,
  client: VanillaClient,
): VanillaCourrier {
  return {
    id: stableNumericId(row.id),
    ref: row.reference,
    type: "client",
    client: client.name,
    clientData: client,
    destinataire: row.client_nom || client.name,
    destinataireAdresse: [client.ville, client.quartier].filter(Boolean).join(" — "),
    objet: row.sujet || "",
    corps: row.contenu || row.message_personnalise || "",
    pj: "",
    modeleKey: row.template_id || "",
    statut: COURRIER_STATUT_NORM[norm(row.statut)] ?? "brouillon",
    modeEnvoi: row.mode_envoi || "",
    dateEnvoi: row.date_envoi || "",
    notesSuivi: "",
    date: row.date_creation,
    isManual: false,
    ...(row.template_titre ? { templateTitre: row.template_titre } : {}),
    ...(row.message_personnalise ? { messagePersonnalise: row.message_personnalise } : {}),
  };
}
