
/**
 * Utilitaires génériques d'export de données (CSV, JSON, TXT).
 *
 * Partagés par les modules Collaborateurs, Missions, Planning et Courrier.
 * Le CSV utilise le séparateur « ; » (cohérent avec l'import clients) avec
 * échappement des guillemets et protection contre l'injection de formules.
 */

export type ExportFormat = "csv" | "json" | "txt";

export interface DataColumn<T> {
  /** Clé machine : sert d'en-tête CSV/TXT et de propriété JSON. */
  key: string;
  /** Libellé lisible (optionnel, à titre documentaire). */
  label?: string;
  /** Valeur de la cellule pour un élément donné. */
  accessor: (item: T) => string | number | boolean | null | undefined;
}

const toCell = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

/**
 * Protège une cellule CSV contre l'injection de formules et échappe les
 * guillemets. Les cellules commençant par =, +, -, @, tab ou retour chariot
 * sont préfixées d'une apostrophe.
 */
const sanitizeCsvCell = (value: string): string => {
  const escaped = value.replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(escaped)) {
    return `"'${escaped}"`;
  }
  return `"${escaped}"`;
};

const triggerDownload = (content: string, mime: string, filename: string): void => {
  const blob = new Blob(["﻿" + content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporte une liste d'éléments dans le format demandé.
 * Le nom de fichier final est `${baseName}_${YYYY-MM-DD}.${format}`.
 */
export function exportData<T>(
  items: T[],
  columns: DataColumn<T>[],
  format: ExportFormat,
  baseName: string
): void {
  const date = new Date().toISOString().split("T")[0];
  const filename = `${baseName}_${date}.${format}`;

  if (format === "json") {
    const rows = items.map((item) => {
      const obj: Record<string, string> = {};
      columns.forEach((col) => {
        obj[col.key] = toCell(col.accessor(item));
      });
      return obj;
    });
    triggerDownload(JSON.stringify(rows, null, 2), "application/json", filename);
    return;
  }

  if (format === "txt") {
    const header = columns.map((col) => col.key).join("\t");
    const lines = items.map((item) =>
      columns
        .map((col) => toCell(col.accessor(item)).replace(/[\t\r\n]+/g, " "))
        .join("\t")
    );
    triggerDownload([header, ...lines].join("\n"), "text/plain", filename);
    return;
  }

  // CSV
  const header = columns.map((col) => sanitizeCsvCell(col.key)).join(";");
  const lines = items.map((item) =>
    columns.map((col) => sanitizeCsvCell(toCell(col.accessor(item)))).join(";")
  );
  triggerDownload([header, ...lines].join("\n"), "text/csv", filename);
}
