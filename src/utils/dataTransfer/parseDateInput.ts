
/**
 * Convertit une valeur de date issue d'un import (CSV/JSON/TXT) en chaîne ISO.
 *
 * Formats acceptés :
 *  - `YYYY-MM-DD`            → ancré à 12:00 pour éviter le décalage UTC.
 *  - `DD/MM/YYYY`            → format français localisé.
 *  - Chaîne ISO complète     → renvoyée telle quelle si valide.
 *
 * Renvoie `undefined` si la valeur est vide ou non interprétable.
 */
export const parseDateInput = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // YYYY-MM-DD
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoDate) {
    return new Date(`${trimmed}T12:00:00`).toISOString();
  }

  // DD/MM/YYYY
  const frDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (frDate) {
    const [, day, month, year] = frDate;
    const dd = day.padStart(2, "0");
    const mm = month.padStart(2, "0");
    return new Date(`${year}-${mm}-${dd}T12:00:00`).toISOString();
  }

  // ISO ou autre format reconnu par Date
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return undefined;
};
