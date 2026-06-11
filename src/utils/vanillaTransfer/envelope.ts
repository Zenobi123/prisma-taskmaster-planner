// Détection, validation et construction de l'enveloppe PRISMA-CLIENTS (v1).

import {
  VANILLA_EXPORT_FORMAT,
  VANILLA_EXPORT_VERSION,
  VANILLA_HISTORY_KEYS,
  VanillaClient,
  VanillaEnvelope,
  VanillaHistorique,
} from "./types";

/** Vrai si l'objet est une enveloppe d'export PRISMA-CLIENTS (vanilla). */
export function isVanillaEnvelope(data: unknown): data is VanillaEnvelope {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return d.format === VANILLA_EXPORT_FORMAT && Array.isArray(d.clients);
}

/** Analyse un contenu de fichier JSON et retourne l'enveloppe si reconnue. */
export function parseVanillaFile(text: string): {
  envelope: VanillaEnvelope | null;
  error?: string;
} {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { envelope: null, error: "Le fichier JSON est invalide ou mal formé." };
  }
  if (!isVanillaEnvelope(data)) return { envelope: null };
  if (typeof data.version === "number" && data.version > VANILLA_EXPORT_VERSION) {
    return {
      envelope: null,
      error: `Version d'export ${data.version} non prise en charge (max: ${VANILLA_EXPORT_VERSION}).`,
    };
  }
  if (data.clients.length === 0) {
    return { envelope: null, error: "L'export ne contient aucun client." };
  }
  return { envelope: data };
}

/** Nombre total d'opérations contenues dans un historique. */
export function countHistorique(historique?: VanillaHistorique | null): number {
  if (!historique) return 0;
  return VANILLA_HISTORY_KEYS.reduce((sum, key) => {
    const arr = historique[key];
    return sum + (Array.isArray(arr) ? arr.length : 0);
  }, 0);
}

/** Détail par collection (pour l'affichage du récapitulatif d'import). */
export function summarizeHistorique(
  historique?: VanillaHistorique | null,
): Array<{ key: string; count: number }> {
  if (!historique) return [];
  return VANILLA_HISTORY_KEYS.map((key) => ({
    key,
    count: Array.isArray(historique[key]) ? historique[key]!.length : 0,
  })).filter((e) => e.count > 0);
}

/** Construit une enveloppe d'export conforme à celle de l'application vanilla. */
export function buildVanillaEnvelope(
  clients: VanillaClient[],
  historique?: VanillaHistorique,
): VanillaEnvelope {
  const withHistory = !!historique;
  return {
    format: VANILLA_EXPORT_FORMAT,
    version: VANILLA_EXPORT_VERSION,
    // Convention vanilla : « client » = export individuel avec historique,
    // « liste » = export de la liste sans historique.
    type: withHistory ? "client" : "liste",
    exportedAt: new Date().toISOString(),
    ...(withHistory ? {} : { count: clients.length }),
    clients,
    ...(withHistory ? { historique } : {}),
  };
}

/** Nom de fichier sûr à partir du nom client (même règle que le vanilla). */
export function slugifyClientName(name: string | undefined): string {
  const base = String(name || "client")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return base || "client";
}
