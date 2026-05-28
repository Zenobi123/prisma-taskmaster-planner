// Clôture de l'année comptable (cabinet-wide).
// Stockage local (comme cabinetConfig) : aucune table Supabase dédiée n'existe.
import { useCallback, useEffect, useState } from 'react';

export interface ClotureExercice {
  /** Année comptable clôturée (ex: 2024). */
  year: number;
  /** Date ISO de la clôture. */
  closedAt: string;
}

const STORAGE_KEY = 'cloturesComptables';
export const CLOTURE_STORAGE_EVENT = 'clotures-comptables-updated';

export function loadClotures(): ClotureExercice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c): c is ClotureExercice => !!c && typeof c.year === 'number')
      .sort((a, b) => b.year - a.year);
  } catch {
    return [];
  }
}

export function saveClotures(list: ClotureExercice[]): void {
  if (typeof window === 'undefined') return;
  const sorted = [...list].sort((a, b) => b.year - a.year);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  window.dispatchEvent(new CustomEvent(CLOTURE_STORAGE_EVENT));
}

export function getMaxClosedYear(list: ClotureExercice[]): number | null {
  if (!list.length) return null;
  return list.reduce((max, c) => Math.max(max, c.year), Number.NEGATIVE_INFINITY);
}

export function isYearClosed(list: ClotureExercice[], year: number): boolean {
  return list.some((c) => c.year === year);
}

/**
 * Détermine si un élément d'une année donnée doit s'afficher selon l'exercice consulté.
 * - vue "courant" : visible si l'année n'est pas clôturée (année > dernière clôturée).
 *   Les éléments non datés (year null) restent visibles dans la vue courante.
 * - vue d'une année clôturée : visible uniquement pour cette année précise.
 */
export function isExerciceVisible(
  viewYear: number | 'courant',
  maxClosedYear: number | null,
  year: number | null | undefined,
): boolean {
  if (viewYear === 'courant') {
    if (maxClosedYear === null) return true;
    if (year === null || year === undefined) return true;
    return year > maxClosedYear;
  }
  return year === viewYear;
}

/**
 * Hook réactif sur le registre des exercices clôturés. Toute mutation est
 * diffusée via un CustomEvent pour synchroniser tous les composants montés.
 */
export function useClotures() {
  const [clotures, setCloturesState] = useState<ClotureExercice[]>(() => loadClotures());

  useEffect(() => {
    const refresh = () => setCloturesState(loadClotures());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener(CLOTURE_STORAGE_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CLOTURE_STORAGE_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const closeYear = useCallback((year: number) => {
    const current = loadClotures();
    if (current.some((c) => c.year === year)) return;
    saveClotures([...current, { year, closedAt: new Date().toISOString() }]);
  }, []);

  const reopenYear = useCallback((year: number) => {
    saveClotures(loadClotures().filter((c) => c.year !== year));
  }, []);

  const maxClosedYear = getMaxClosedYear(clotures);

  return {
    clotures,
    maxClosedYear,
    isYearClosed: (year: number) => isYearClosed(clotures, year),
    closeYear,
    reopenYear,
  };
}
