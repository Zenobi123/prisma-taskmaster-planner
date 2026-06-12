import { buildVanillaEnvelope, isVanillaEnvelope } from "./envelope";
import {
  VanillaClient,
  VanillaEnvelope,
  VanillaHistorique,
} from "./types";

export const VANILLA_BACKUP_APPLICATION = "PRISMA GESTION";
export const VANILLA_BACKUP_VERSION = "2.0";

export interface VanillaBackup {
  application: typeof VANILLA_BACKUP_APPLICATION;
  version: string;
  exportDate: string;
  clients: VanillaClient[];
  factures?: VanillaHistorique["factures"];
  devis?: VanillaHistorique["devis"];
  recus?: VanillaHistorique["recus"];
  propositions?: VanillaHistorique["propositions"];
  courriers?: VanillaHistorique["courriers"];
  notes?: VanillaHistorique["notes"];
  contrats?: VanillaHistorique["contrats"];
  [key: string]: unknown;
}

export interface ParsedVanillaTransfer {
  envelope: VanillaEnvelope | null;
  source: "backup" | "clients" | null;
  exportedAt?: string;
  ignoredCollections: Array<{ key: string; count: number }>;
  error?: string;
}

const transferableHistory = (data: Record<string, unknown>): VanillaHistorique => ({
  factures: Array.isArray(data.factures) ? data.factures : [],
  devis: Array.isArray(data.devis) ? data.devis : [],
  recus: Array.isArray(data.recus) ? data.recus : [],
  propositions: Array.isArray(data.propositions) ? data.propositions : [],
  courriers: Array.isArray(data.courriers) ? data.courriers : [],
  notes: Array.isArray(data.notes) ? data.notes : [],
  contrats: Array.isArray(data.contrats) ? data.contrats : [],
});

/** Convertit une sauvegarde globale de l'application vanilla en enveloppe importable. */
export function parseVanillaTransferFile(text: string): ParsedVanillaTransfer {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      envelope: null,
      source: null,
      ignoredCollections: [],
      error: "Le fichier JSON est invalide ou corrompu.",
    };
  }

  if (isVanillaEnvelope(data)) {
    if (data.clients.length === 0) {
      return { envelope: null, source: "clients", ignoredCollections: [], error: "Le fichier ne contient aucun client." };
    }
    return { envelope: data, source: "clients", exportedAt: data.exportedAt, ignoredCollections: [] };
  }

  if (typeof data !== "object" || data === null) {
    return { envelope: null, source: null, ignoredCollections: [], error: "Format de sauvegarde non reconnu." };
  }

  const backup = data as Record<string, unknown>;
  if (backup.application !== VANILLA_BACKUP_APPLICATION || !Array.isArray(backup.clients)) {
    return {
      envelope: null,
      source: null,
      ignoredCollections: [],
      error: "Ce fichier n'est ni une sauvegarde PRISMA GESTION vanilla, ni un export PRISMA-CLIENTS.",
    };
  }
  if (backup.clients.length === 0) {
    return { envelope: null, source: "backup", ignoredCollections: [], error: "La sauvegarde ne contient aucun client." };
  }

  const history = transferableHistory(backup);
  const supportedKeys = new Set(["application", "version", "exportDate", "clients", ...Object.keys(history)]);
  const ignoredCollections = Object.entries(backup)
    .filter(([key, value]) => !supportedKeys.has(key) && Array.isArray(value) && value.length > 0)
    .map(([key, value]) => ({ key, count: (value as unknown[]).length }));

  return {
    envelope: buildVanillaEnvelope(backup.clients as VanillaClient[], history),
    source: "backup",
    exportedAt: typeof backup.exportDate === "string" ? backup.exportDate : undefined,
    ignoredCollections,
  };
}

/** Produit une sauvegarde globale que l'application vanilla peut restaurer. */
export function buildVanillaBackup(envelope: VanillaEnvelope): VanillaBackup {
  const history = envelope.historique || {};
  return {
    application: VANILLA_BACKUP_APPLICATION,
    version: VANILLA_BACKUP_VERSION,
    exportDate: new Date().toISOString(),
    clients: envelope.clients,
    factures: history.factures || [],
    recus: history.recus || [],
    propositions: history.propositions || [],
    devis: history.devis || [],
    courriers: history.courriers || [],
    notes: history.notes || [],
    contrats: history.contrats || [],
  };
}
