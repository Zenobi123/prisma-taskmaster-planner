import { RegimeFiscal, ClientType, Client } from "@/types/client";

/** Colonnes canoniques attendues pour l'import de clients (ordre du modèle CSV). */
export const CSV_COLUMNS = [
  "type",
  "nom",
  "raisonsociale",
  "niu",
  "centrerattachement",
  "regimefiscal",
  "ville",
  "quartier",
  "telephone",
  "email",
  "contact_principal",
  "secteuractivite",
  "chiffreaffaires",
] as const;

export type CanonicalKey = (typeof CSV_COLUMNS)[number];
export type ClientRecord = Partial<Record<CanonicalKey, string>>;
export type ParseResult = { clients: Partial<Client>[]; errors: string[] };
export type ImportFormat = "csv" | "json" | "txt";

export const VALID_TYPES: ClientType[] = ["physique", "morale"];
export const VALID_REGIMES: RegimeFiscal[] = ["reel", "igs", "non_professionnel", "obnl"];

export const SAMPLE_ROWS: ClientRecord[] = [
  {
    type: "physique",
    nom: "Dupont Jean",
    raisonsociale: "",
    niu: "NIU001",
    centrerattachement: "CFLP DOUALA 1",
    regimefiscal: "reel",
    ville: "Douala",
    quartier: "Akwa",
    telephone: "+237600000000",
    email: "jean@example.com",
    contact_principal: "Dupont",
    secteuractivite: "Commerce",
    chiffreaffaires: "5000000",
  },
  {
    type: "morale",
    nom: "",
    raisonsociale: "Entreprise SARL",
    niu: "NIU002",
    centrerattachement: "CFLP YAOUNDE 1",
    regimefiscal: "igs",
    ville: "Yaoundé",
    quartier: "Bastos",
    telephone: "+237600000001",
    email: "contact@entreprise.cm",
    contact_principal: "M. Kamga",
    secteuractivite: "Services",
    chiffreaffaires: "12000000",
  },
];

/** Normalise une clé pour la rendre insensible à la casse, aux accents et aux séparateurs. */
export function normKey(key: string): string {
  return key
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Table de correspondance clé normalisée -> clé canonique (gère aussi les libellés d'export).
export const KEY_BY_NORM: Record<string, CanonicalKey> = (() => {
  const map: Record<string, CanonicalKey> = {};
  for (const col of CSV_COLUMNS) {
    map[normKey(col)] = col;
  }
  const extra: Record<string, CanonicalKey> = {
    centre: "centrerattachement",
    centrederattachement: "centrerattachement",
    regime: "regimefiscal",
    tel: "telephone",
    secteur: "secteuractivite",
    secteurdactivite: "secteuractivite",
    ca: "chiffreaffaires",
    contactprincipal: "contact_principal",
  };
  return { ...map, ...extra };
})();

/** Convertit un objet brut (JSON/texte) en enregistrement à clés canoniques. */
export function canonicalize(raw: Record<string, unknown>): ClientRecord {
  const rec: ClientRecord = {};
  for (const [key, value] of Object.entries(raw)) {
    const canon = KEY_BY_NORM[normKey(key)];
    if (!canon) continue;
    rec[canon] = value === null || value === undefined ? "" : String(value).trim();
  }
  return rec;
}

/** Valide un enregistrement et le transforme en client partiel, ou retourne une erreur. */
export function buildClient(
  rec: ClientRecord,
  label: string
): { client?: Partial<Client>; error?: string } {
  const rawType = (rec.type ?? "").trim().toLowerCase();
  const type: ClientType | string = rawType.includes("physique")
    ? "physique"
    : rawType.includes("morale")
      ? "morale"
      : rawType;

  const nom = (rec.nom ?? "").trim();
  const raisonsociale = (rec.raisonsociale ?? "").trim();
  const niu = (rec.niu ?? "").trim();
  const centrerattachement = (rec.centrerattachement ?? "").trim();
  const regimefiscal = (rec.regimefiscal ?? "").trim().toLowerCase() as RegimeFiscal;
  const ville = (rec.ville ?? "").trim();
  const quartier = (rec.quartier ?? "").trim();
  const telephone = (rec.telephone ?? "").trim();
  const email = (rec.email ?? "").trim();
  const contact_principal = (rec.contact_principal ?? "").trim();
  const secteuractivite = (rec.secteuractivite ?? "").trim();
  const chiffreaffairesStr = (rec.chiffreaffaires ?? "").trim();

  if (!VALID_TYPES.includes(type as ClientType)) {
    return { error: `${label}: type "${rec.type ?? ""}" invalide (attendu: physique ou morale).` };
  }
  if (!niu) {
    return { error: `${label}: le NIU est obligatoire.` };
  }
  if (!VALID_REGIMES.includes(regimefiscal)) {
    return {
      error: `${label}: régime fiscal "${rec.regimefiscal ?? ""}" invalide (attendu: ${VALID_REGIMES.join(", ")}).`,
    };
  }

  const chiffreaffaires = chiffreaffairesStr ? Number(chiffreaffairesStr) : undefined;
  if (chiffreaffairesStr && isNaN(chiffreaffaires!)) {
    return { error: `${label}: chiffre d'affaires "${chiffreaffairesStr}" n'est pas un nombre valide.` };
  }

  return {
    client: {
      type: type as ClientType,
      nom: nom || undefined,
      raisonsociale: raisonsociale || undefined,
      niu,
      centrerattachement,
      regimefiscal,
      adresse: {
        ville,
        quartier,
        lieuDit: "",
      },
      contact: {
        telephone,
        email,
        contact_principal,
      },
      secteuractivite,
      chiffreaffaires,
      interactions: [],
      statut: "actif",
      gestionexternalisee: false,
    },
  };
}

export function parseCSV(text: string): ParseResult {
  const errors: string[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    errors.push("Le fichier doit contenir au moins un en-tête et une ligne de données.");
    return { clients: [], errors };
  }

  const dataLines = lines.slice(1);
  const clients: Partial<Client>[] = [];

  dataLines.forEach((line, index) => {
    const values = line.split(";");
    const rowNum = index + 2; // 1-indexé, en tenant compte de l'en-tête

    if (values.length < CSV_COLUMNS.length) {
      errors.push(`Ligne ${rowNum}: nombre de colonnes insuffisant (${values.length}/${CSV_COLUMNS.length}).`);
      return;
    }

    const rec: ClientRecord = {};
    CSV_COLUMNS.forEach((col, i) => {
      rec[col] = (values[i] ?? "").trim();
    });

    const { client, error } = buildClient(rec, `Ligne ${rowNum}`);
    if (error) errors.push(error);
    else if (client) clients.push(client);
  });

  return { clients, errors };
}

export function parseJSON(text: string): ParseResult {
  const errors: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { clients: [], errors: ["Le fichier JSON est invalide ou mal formé."] };
  }

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) {
    return { clients: [], errors: ["Le fichier JSON ne contient aucun client."] };
  }

  const clients: Partial<Client>[] = [];
  rows.forEach((row, index) => {
    const label = `Élément ${index + 1}`;
    if (typeof row !== "object" || row === null) {
      errors.push(`${label}: format invalide (objet attendu).`);
      return;
    }
    const rec = canonicalize(row as Record<string, unknown>);
    const { client, error } = buildClient(rec, label);
    if (error) errors.push(error);
    else if (client) clients.push(client);
  });

  return { clients, errors };
}

export function parseText(text: string): ParseResult {
  const errors: string[] = [];
  // Les blocs sont séparés par une ligne de tirets (ou une ligne vide).
  const blocks = text
    .split(/\r?\n-{3,}\r?\n|\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  if (blocks.length === 0) {
    return { clients: [], errors: ["Le fichier texte ne contient aucun client."] };
  }

  const clients: Partial<Client>[] = [];
  blocks.forEach((block, index) => {
    const label = `Bloc ${index + 1}`;
    const raw: Record<string, string> = {};
    block.split(/\r?\n/).forEach((line) => {
      const sep = line.indexOf(":");
      if (sep === -1) return;
      const key = line.slice(0, sep).trim();
      const value = line.slice(sep + 1).trim();
      if (key) raw[key] = value;
    });

    if (Object.keys(raw).length === 0) {
      errors.push(`${label}: aucune ligne « champ: valeur » détectée.`);
      return;
    }

    const rec = canonicalize(raw);
    const { client, error } = buildClient(rec, label);
    if (error) errors.push(error);
    else if (client) clients.push(client);
  });

  return { clients, errors };
}

export function getFormat(fileName: string): ImportFormat | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".txt")) return "txt";
  return null;
}

export function parseByFormat(format: ImportFormat, text: string): ParseResult {
  switch (format) {
    case "csv":
      return parseCSV(text);
    case "json":
      return parseJSON(text);
    case "txt":
      return parseText(text);
  }
}

/** Construit le contenu d'un modèle d'import téléchargeable (sans toucher au DOM). */
export function buildTemplate(format: ImportFormat): {
  content: string;
  mime: string;
  fileName: string;
  bom: boolean;
} {
  if (format === "csv") {
    const header = CSV_COLUMNS.join(";");
    const rows = SAMPLE_ROWS.map((r) => CSV_COLUMNS.map((c) => r[c] ?? "").join(";"));
    return {
      content: [header, ...rows].join("\n"),
      mime: "text/csv;charset=utf-8;",
      fileName: "modele_import_clients.csv",
      bom: true,
    };
  }
  if (format === "json") {
    const content = JSON.stringify(
      SAMPLE_ROWS.map((r) => ({
        ...r,
        chiffreaffaires: r.chiffreaffaires ? Number(r.chiffreaffaires) : 0,
      })),
      null,
      2
    );
    return { content, mime: "application/json", fileName: "modele_import_clients.json", bom: false };
  }
  const blocks = SAMPLE_ROWS.map((r) => CSV_COLUMNS.map((c) => `${c}: ${r[c] ?? ""}`).join("\n"));
  return {
    content: blocks.join("\n" + "-".repeat(40) + "\n"),
    mime: "text/plain;charset=utf-8;",
    fileName: "modele_import_clients.txt",
    bom: false,
  };
}
