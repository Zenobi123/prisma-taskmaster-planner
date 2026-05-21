import { describe, it, expect } from 'vitest';
import { paiementToRecuPrintData } from '@/lib/spec/adapters';
import type { Paiement } from '@/types/paiement';
import type { Facture } from '@/types/facture';

const baseFacture: Facture = {
  id: 'FAC-1',
  client_id: 'C1',
  date: '2026-01-10',
  echeance: '2026-02-10',
  montant: 100000,
  montant_impots: 60000,
  montant_honoraires: 40000,
  status: 'envoyée',
  status_paiement: 'non_payée',
  prestations: [
    { id: 'P1', description: 'Patente', type: 'impot', quantite: 1, prix_unitaire: 60000, montant: 60000 },
    { id: 'P2', description: 'Tenue comptable', type: 'honoraire', quantite: 1, prix_unitaire: 40000, montant: 40000 },
  ],
};

function makePaiement(overrides: Partial<Paiement>): Paiement {
  return {
    id: 'PAY-1',
    facture: 'FAC-1',
    client: 'Client SARL',
    client_id: 'C1',
    date: '2026-01-15',
    montant: 100000,
    mode: 'virement',
    reference: 'RECU-1',
    solde_restant: 0,
    ...overrides,
  };
}

describe('paiementToRecuPrintData — ventilation Impôts / Honoraires', () => {
  it('répartit exactement un paiement partiel selon le type des prestations payées', () => {
    const paiement = makePaiement({
      montant: 60000,
      type_paiement: 'partiel',
      prestations_payees: [{ id: 'P1', montant_modifie: 60000 }],
    });
    const data = paiementToRecuPrintData(paiement, null, baseFacture);
    expect(data.montantImpots).toBe(60000);
    expect(data.montantHonoraires).toBe(0);
  });

  it('répartit un paiement total au prorata de la composition de la facture', () => {
    const paiement = makePaiement({ montant: 100000, type_paiement: 'total', prestations_payees: [] });
    const data = paiementToRecuPrintData(paiement, null, baseFacture);
    expect(data.montantImpots).toBe(60000);
    expect(data.montantHonoraires).toBe(40000);
  });

  it('ne ventile pas sans facture liée (crédit / avance)', () => {
    const paiement = makePaiement({ facture: '', est_credit: true });
    const data = paiementToRecuPrintData(paiement, null, null);
    expect(data.montantImpots).toBe(0);
    expect(data.montantHonoraires).toBe(0);
  });
});
