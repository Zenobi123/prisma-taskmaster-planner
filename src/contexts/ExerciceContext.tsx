import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useClotures, isExerciceVisible, type ClotureExercice } from '@/lib/spec/clotureComptable';

/** "courant" = exercice(s) en cours (non clôturés). Sinon une année clôturée consultée. */
export type ExerciceView = number | 'courant';

const VIEW_STORAGE_KEY = 'exerciceViewYear';

interface ExerciceContextValue {
  clotures: ClotureExercice[];
  maxClosedYear: number | null;
  /** Vue courante : "courant" ou une année clôturée en consultation. */
  viewYear: ExerciceView;
  setViewYear: (view: ExerciceView) => void;
  /** true quand on consulte un exercice clôturé (lecture seule). */
  isConsultingClosed: boolean;
  isYearClosed: (year: number) => boolean;
  /** Un élément de cette année doit-il s'afficher dans la vue courante ? */
  isVisibleByYear: (year: number | null | undefined) => boolean;
  /** Idem mais à partir d'une date ISO. */
  isVisibleByDate: (date: string | null | undefined) => boolean;
  getYearFromDate: (date: string | null | undefined) => number | null;
}

function defaultIsVisible(): boolean {
  return true;
}

const FALLBACK_VALUE: ExerciceContextValue = {
  clotures: [],
  maxClosedYear: null,
  viewYear: 'courant',
  setViewYear: () => {},
  isConsultingClosed: false,
  isYearClosed: () => false,
  isVisibleByYear: defaultIsVisible,
  isVisibleByDate: defaultIsVisible,
  getYearFromDate: () => null,
};

const ExerciceContext = createContext<ExerciceContextValue | null>(null);

function readStoredView(): ExerciceView {
  if (typeof window === 'undefined') return 'courant';
  const raw = window.sessionStorage.getItem(VIEW_STORAGE_KEY);
  if (!raw || raw === 'courant') return 'courant';
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 'courant' : parsed;
}

export function ExerciceProvider({ children }: { children: React.ReactNode }) {
  const { clotures, maxClosedYear, isYearClosed } = useClotures();
  const [viewYear, setViewYearState] = useState<ExerciceView>(readStoredView);

  const setViewYear = useCallback((view: ExerciceView) => {
    setViewYearState(view);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        VIEW_STORAGE_KEY,
        view === 'courant' ? 'courant' : String(view),
      );
    }
  }, []);

  // Si l'année consultée n'est plus clôturée (réouverture), revenir au courant.
  useEffect(() => {
    if (viewYear !== 'courant' && !isYearClosed(viewYear)) {
      setViewYear('courant');
    }
  }, [viewYear, isYearClosed, setViewYear]);

  const getYearFromDate = useCallback((date: string | null | undefined): number | null => {
    if (!date) return null;
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? null : d.getFullYear();
  }, []);

  const isVisibleByYear = useCallback(
    (year: number | null | undefined): boolean => isExerciceVisible(viewYear, maxClosedYear, year),
    [viewYear, maxClosedYear],
  );

  const isVisibleByDate = useCallback(
    (date: string | null | undefined): boolean => isVisibleByYear(getYearFromDate(date)),
    [isVisibleByYear, getYearFromDate],
  );

  const value = useMemo<ExerciceContextValue>(
    () => ({
      clotures,
      maxClosedYear,
      viewYear,
      setViewYear,
      isConsultingClosed: viewYear !== 'courant',
      isYearClosed,
      isVisibleByYear,
      isVisibleByDate,
      getYearFromDate,
    }),
    [clotures, maxClosedYear, viewYear, setViewYear, isYearClosed, isVisibleByYear, isVisibleByDate, getYearFromDate],
  );

  return <ExerciceContext.Provider value={value}>{children}</ExerciceContext.Provider>;
}

export function useExercice(): ExerciceContextValue {
  const ctx = useContext(ExerciceContext);
  if (!ctx) return FALLBACK_VALUE;
  return ctx;
}
