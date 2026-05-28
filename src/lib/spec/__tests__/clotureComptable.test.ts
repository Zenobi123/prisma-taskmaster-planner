import { describe, it, expect } from 'vitest';
import {
  getMaxClosedYear,
  isYearClosed,
  isExerciceVisible,
  type ClotureExercice,
} from '../clotureComptable';

const clotures = (years: number[]): ClotureExercice[] =>
  years.map((year) => ({ year, closedAt: new Date().toISOString() }));

describe('getMaxClosedYear', () => {
  it('returns null when no closures', () => {
    expect(getMaxClosedYear([])).toBeNull();
  });

  it('returns the highest closed year', () => {
    expect(getMaxClosedYear(clotures([2022, 2024, 2023]))).toBe(2024);
  });
});

describe('isYearClosed', () => {
  it('detects closed years', () => {
    const list = clotures([2023, 2024]);
    expect(isYearClosed(list, 2024)).toBe(true);
    expect(isYearClosed(list, 2025)).toBe(false);
  });
});

describe('isExerciceVisible', () => {
  describe('vue courante (aucune clôture)', () => {
    it('affiche toutes les années', () => {
      expect(isExerciceVisible('courant', null, 2020)).toBe(true);
      expect(isExerciceVisible('courant', null, 2025)).toBe(true);
      expect(isExerciceVisible('courant', null, null)).toBe(true);
    });
  });

  describe('vue courante (2024 clôturé)', () => {
    it('masque les années clôturées et antérieures', () => {
      expect(isExerciceVisible('courant', 2024, 2024)).toBe(false);
      expect(isExerciceVisible('courant', 2024, 2023)).toBe(false);
    });

    it("affiche l'année en cours et les suivantes", () => {
      expect(isExerciceVisible('courant', 2024, 2025)).toBe(true);
      expect(isExerciceVisible('courant', 2024, 2026)).toBe(true);
    });

    it('garde visibles les éléments non datés', () => {
      expect(isExerciceVisible('courant', 2024, null)).toBe(true);
      expect(isExerciceVisible('courant', 2024, undefined)).toBe(true);
    });
  });

  describe("consultation d'une année clôturée", () => {
    it("n'affiche que l'année consultée", () => {
      expect(isExerciceVisible(2024, 2024, 2024)).toBe(true);
      expect(isExerciceVisible(2024, 2024, 2025)).toBe(false);
      expect(isExerciceVisible(2024, 2024, 2023)).toBe(false);
      expect(isExerciceVisible(2024, 2024, null)).toBe(false);
    });
  });
});
