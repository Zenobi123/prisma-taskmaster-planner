import { describe, it, expect } from 'vitest';
import { numberToWordsFr, montantEnLettres } from '@/utils/numberToWords';

// Fidélité au vanilla recu-app.html / numberToWords : liaison de l'unité par
// trait d'union (jamais « et »), « quatre-vingt » invariable, « cent » invariable.
describe('numberToWordsFr — règles fidèles au vanilla', () => {
  it('liaison de l’unité sans « et »', () => {
    expect(numberToWordsFr(21)).toBe('vingt-un');
    expect(numberToWordsFr(31)).toBe('trente-un');
    expect(numberToWordsFr(61)).toBe('soixante-un');
    expect(numberToWordsFr(71)).toBe('soixante-onze');
  });

  it('soixante-dix / quatre-vingt invariable', () => {
    expect(numberToWordsFr(70)).toBe('soixante-dix');
    expect(numberToWordsFr(75)).toBe('soixante-quinze');
    expect(numberToWordsFr(80)).toBe('quatre-vingt');
    expect(numberToWordsFr(81)).toBe('quatre-vingt-un');
    expect(numberToWordsFr(90)).toBe('quatre-vingt-dix');
    expect(numberToWordsFr(91)).toBe('quatre-vingt-onze');
  });

  it('« cent » reste invariable', () => {
    expect(numberToWordsFr(100)).toBe('cent');
    expect(numberToWordsFr(200)).toBe('deux cent');
    expect(numberToWordsFr(250)).toBe('deux cent cinquante');
    // « cent » suivi de « mille » : invariable (vs « cinq cents mille »)
    expect(numberToWordsFr(500000)).toBe('cinq cent mille');
  });

  it('milliers et au-delà', () => {
    expect(numberToWordsFr(1000)).toBe('mille');
    expect(numberToWordsFr(150000)).toBe('cent cinquante mille');
    // Au-delà de 1 000 000, on convertit en lettres (le vanilla renvoyait les
    // chiffres bruts — défaut manifeste corrigé en conservant le même style).
    expect(numberToWordsFr(1_500_000)).toBe('un million cinq cent mille');
    expect(numberToWordsFr(2_000_000)).toBe('deux millions');
  });

  it('montantEnLettres : capitalise et suffixe « F CFA »', () => {
    expect(montantEnLettres(150000)).toBe('Cent cinquante mille F CFA');
  });
});
