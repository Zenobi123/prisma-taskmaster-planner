
/**
 * Utilitaires génériques d'import de données (CSV, JSON, TXT).
 *
 * Renvoie des lignes normalisées sous forme d'enregistrements clé → valeur,
 * les clés (en-têtes) étant mises en minuscules pour faciliter le mapping.
 */

export type ImportRow = Record<string, string>;

export interface ImportColumnSpec {
  key: string;
  label: string;
  required?: boolean;
  /** Valeur d'exemple utilisée pour générer le modèle d'import. */
  example?: string;
}

/**
 * Découpe une ligne délimitée en gérant les guillemets (RFC 4180 simplifié)
 * et retire l'éventuelle apostrophe de protection anti-injection.
 */
const parseDelimitedLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);

  return result.map((cell) => {
    let value = cell.trim();
    // Retire l'apostrophe ajoutée à l'export pour neutraliser les formules.
    if (value.startsWith("'") && /^[=+\-@]/.test(value.slice(1))) {
      value = value.slice(1);
    }
    return value;
  });
};

const detectDelimiter = (headerLine: string): string => {
  if (headerLine.includes("\t")) return "\t";
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return commas > semicolons ? "," : ";";
};

const parseDelimited = (text: string): ImportRow[] => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseDelimitedLine(lines[0], delimiter).map((h) =>
    h.toLowerCase()
  );

  return lines.slice(1).map((line) => {
    const values = parseDelimitedLine(line, delimiter);
    const row: ImportRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
};

const parseJson = (text: string): ImportRow[] => {
  const data = JSON.parse(text);
  const array = Array.isArray(data) ? data : [data];
  return array.map((item) => {
    const row: ImportRow = {};
    if (item && typeof item === "object") {
      Object.entries(item).forEach(([key, value]) => {
        row[key.toLowerCase()] =
          value === null || value === undefined ? "" : String(value);
      });
    }
    return row;
  });
};

/**
 * Détermine l'extension (sans le point) à partir d'un nom de fichier.
 */
export const getFileExtension = (fileName: string): string =>
  fileName.split(".").pop()?.toLowerCase() ?? "";

export const SUPPORTED_IMPORT_EXTENSIONS = ["csv", "json", "txt"] as const;

/**
 * Analyse le contenu d'un fichier importé en fonction de son extension.
 * Lève une erreur lisible si le format est invalide.
 */
export const parseImportContent = (
  text: string,
  extension: string
): ImportRow[] => {
  if (extension === "json") {
    try {
      return parseJson(text);
    } catch {
      throw new Error("Le fichier JSON est invalide ou mal formé.");
    }
  }
  if (extension === "csv" || extension === "txt") {
    return parseDelimited(text);
  }
  throw new Error(
    "Format de fichier non pris en charge. Utilisez un fichier CSV, JSON ou TXT."
  );
};

/**
 * Génère et télécharge un modèle CSV à partir d'une spécification de colonnes.
 */
export const downloadImportTemplate = (
  columns: ImportColumnSpec[],
  baseName: string
): void => {
  const header = columns.map((col) => col.key).join(";");
  const example = columns.map((col) => col.example ?? "").join(";");
  const csv = [header, example].join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `modele_import_${baseName}.csv`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
