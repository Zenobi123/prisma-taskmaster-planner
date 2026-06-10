import { describe, expect, it } from 'vitest';
import { computeMontantPaye, computeStatutPaiement } from '../facturePaiement';

const TODAY = new Date(2026, 5, 10); // 10 juin 2026

describe('computeStatutPaiement', () => {
  it('reste non_payée sans paiement et avant échéance', () => {
    expect(computeStatutPaiement(100_000, 0, '2026-07-10', TODAY)).toBe('non_payée');
  });

  it('devient partiellement_payée dès le premier règlement partiel', () => {
    expect(computeStatutPaiement(100_000, 40_000, '2026-07-10', TODAY)).toBe('partiellement_payée');
  });

  it('devient payée quand le cumul des reçus atteint le montant', () => {
    expect(computeStatutPaiement(100_000, 100_000, '2026-07-10', TODAY)).toBe('payée');
  });

  it('reste payée même au-delà du montant (trop-perçu)', () => {
    expect(computeStatutPaiement(100_000, 120_000, '2026-01-01', TODAY)).toBe('payée');
  });

  it('passe en_retard après échéance si non soldée', () => {
    expect(computeStatutPaiement(100_000, 0, '2026-06-09', TODAY)).toBe('en_retard');
    expect(computeStatutPaiement(100_000, 40_000, '2026-06-09', TODAY)).toBe('en_retard');
  });

  it("n'est pas en retard le jour même de l'échéance", () => {
    expect(computeStatutPaiement(100_000, 0, '2026-06-10', TODAY)).toBe('non_payée');
  });

  it('payée prime sur en_retard', () => {
    expect(computeStatutPaiement(100_000, 100_000, '2026-01-01', TODAY)).toBe('payée');
  });

  it('accepte les échéances au format DD/MM/YYYY', () => {
    expect(computeStatutPaiement(100_000, 0, '09/06/2026', TODAY)).toBe('en_retard');
    expect(computeStatutPaiement(100_000, 0, '11/06/2026', TODAY)).toBe('non_payée');
  });

  it('ignore une échéance absente ou invalide', () => {
    expect(computeStatutPaiement(100_000, 50_000, null, TODAY)).toBe('partiellement_payée');
    expect(computeStatutPaiement(100_000, 0, 'n/a', TODAY)).toBe('non_payée');
  });

  it('une facture à 0 sans paiement reste non_payée', () => {
    expect(computeStatutPaiement(0, 0, '2026-07-10', TODAY)).toBe('non_payée');
  });
});

describe('computeMontantPaye', () => {
  it('additionne les montants des paiements', () => {
    expect(computeMontantPaye([{ montant: 10_000 }, { montant: 5_500 }])).toBe(15_500);
  });

  it('ignore les montants invalides', () => {
    expect(computeMontantPaye([{ montant: null }, { montant: undefined }, { montant: 100 }])).toBe(100);
  });

  it('retourne 0 sans paiement', () => {
    expect(computeMontantPaye([])).toBe(0);
  });
});
