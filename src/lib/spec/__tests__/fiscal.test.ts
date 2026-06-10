import { describe, it, expect } from 'vitest';
import {
  calculateIGS,
  calculatePatente,
  calculateSoldeIR,
  calculateTDL,
  calculateImmoTaxes,
  calculateLicence,
  computeAllTaxes,
  computeAgencyImmo,
  getClientBiensImmo,
  buildImmoTaxLabel,
  formatMoney,
  normalizeCivilite,
  getCiviliteLongue,
  getSoldeTaxLabel,
  sanitizePdfSegment,
  type ClientSpec,
  type AgenceSpec,
} from '../fiscal';

const baseClient = (override: Partial<ClientSpec> = {}): ClientSpec => ({
  id: 1,
  type: 'Personne morale',
  name: 'Test',
  niu: 'M0X',
  cdi: 'CDI YDE 1',
  ville: 'Yaoundé',
  quartier: 'Centre',
  phone: '690000000',
  civilite: 'M.',
  secteur: 'Services',
  externalise: 'Non',
  statut: 'Actif',
  modePaiementIGS: 'annuel',
  modePaiementPSL: 'annuel',
  createdAt: new Date().toISOString(),
  ...override,
});

describe('SPEC §2 — calcul IGS', () => {
  it('classe 6 sans CGA', () => {
    const r = calculateIGS(3_000_000, false);
    expect(r.classe).toBe(6);
    expect(r.montantPrincipal).toBe(150_000);
    expect(r.montant).toBe(150_000);
    expect(r.horsBareme).toBe(false);
  });
  it('CGA divise par 2', () => {
    const r = calculateIGS(3_000_000, true);
    expect(r.montant).toBe(75_000);
    expect(r.montantPrincipal).toBe(150_000); // base TDL inchangée
  });
  it('hors barème si CA > 50 000 000', () => {
    const r = calculateIGS(60_000_000, false);
    expect(r.horsBareme).toBe(true);
    expect(r.montant).toBe(0);
  });
});

describe('SPEC §2 — Patente', () => {
  it('plancher', () => {
    expect(calculatePatente(1_000_000).montant).toBe(141_500);
  });
  it('taux normal', () => {
    expect(calculatePatente(100_000_000).montant).toBe(283_000);
  });
  it('plafond', () => {
    expect(calculatePatente(2_000_000_000).montant).toBe(4_500_000);
  });
});

describe('SPEC §2 — Solde IR (0,1 % si CA ≥ 15 M)', () => {
  it('non applicable sous le seuil', () => {
    const r = calculateSoldeIR(10_000_000);
    expect(r.applicable).toBe(false);
    expect(r.montant).toBe(0);
  });
  it('applicable au seuil', () => {
    const r = calculateSoldeIR(15_000_000);
    expect(r.applicable).toBe(true);
    expect(r.montant).toBe(15_000);
  });
});

describe('SPEC §2 — TDL', () => {
  it('classe 6 → 22 500 (palier ≤ 150 000)', () => {
    expect(calculateTDL(150_000)).toBe(22_500);
  });
  it('palier > 500 000', () => {
    expect(calculateTDL(2_000_000)).toBe(90_000);
  });
  it('zéro si IGS=0', () => {
    expect(calculateTDL(0)).toBe(0);
  });
});

describe('SPEC §2 — Immobilier', () => {
  it('locataire IGS : PSL=10%, Bail=10%', () => {
    const c = baseClient({
      regimeFiscal: 'IGS',
      statutImmo: 'Locataire',
      loyerMensuel: 100_000,
      loyerAnnuel: 1_200_000,
    });
    const r = calculateImmoTaxes(c);
    expect(r.psl).toBe(120_000);
    expect(r.bail).toBe(120_000);
    expect(r.tauxBail).toBe(10);
  });
  it('OBNL : PSL=0, Bail=5%', () => {
    const c = baseClient({
      regimeFiscal: 'OBNL',
      statutImmo: 'Locataire',
      loyerMensuel: 100_000,
      loyerAnnuel: 1_200_000,
    });
    const r = calculateImmoTaxes(c);
    expect(r.psl).toBe(0);
    expect(r.bail).toBe(60_000);
    expect(r.tauxBail).toBe(5);
  });
  it('TF = 0,1 % de la valeur du bien', () => {
    const c = baseClient({ statutImmo: 'Proprietaire', valeurBien: 50_000_000 });
    expect(calculateImmoTaxes(c).tf).toBe(50_000);
  });
});

describe('SPEC §2 — Licence', () => {
  it('IGS × 2 si vendeur de boissons régime IGS', () => {
    expect(calculateLicence('IGS', 60_000, 0, true)).toBe(120_000);
  });
  it('Patente × 2 si vendeur de boissons régime Réel', () => {
    expect(calculateLicence('Reel', 0, 200_000, true)).toBe(400_000);
  });
  it('0 sinon', () => {
    expect(calculateLicence('IGS', 60_000, 0, false)).toBe(0);
    expect(calculateLicence('OBNL', 0, 0, true)).toBe(0);
  });
});

describe('SPEC §2 — computeAllTaxes (sanity)', () => {
  it('IGS classe 6 + TDL 22 500', () => {
    const c = baseClient({ regimeFiscal: 'IGS', chiffreAffaires: 3_000_000 });
    const r = computeAllTaxes(c);
    expect(r.igs).toBe(150_000);
    expect(r.igsClasse).toBe(6);
    expect(r.tdl).toBe(22_500);
  });
});

describe('SPEC §10.10 — formatMoney', () => {
  it('formate avec espaces', () => {
    expect(formatMoney(120_000).replace(/\s/g, ' ')).toBe('120 000 F CFA');
  });
  it('zéro', () => {
    expect(formatMoney(0)).toBe('0 F CFA');
  });
  it('undefined', () => {
    expect(formatMoney(undefined)).toBe('0 F CFA');
  });
});

describe('SPEC §2.1 — normalizeCivilite', () => {
  it('M./Mme', () => {
    expect(normalizeCivilite('Madame')).toBe('Mme');
    expect(normalizeCivilite('Monsieur')).toBe('M.');
    expect(normalizeCivilite('Mme')).toBe('Mme');
    expect(normalizeCivilite('M.')).toBe('M.');
  });
  it('fallback', () => {
    expect(normalizeCivilite('inconnu')).toBe('M.');
    expect(normalizeCivilite('', 'Mme')).toBe('Mme');
  });
  it('civilité longue', () => {
    expect(getCiviliteLongue('M.')).toBe('Monsieur');
    expect(getCiviliteLongue('Mme')).toBe('Madame');
  });
});

describe('SPEC §5 — Solde IR/IS selon type', () => {
  it('Personne morale → Solde IS', () => {
    expect(getSoldeTaxLabel({ type: 'Personne morale' })).toBe('Solde IS');
  });
  it('Personne physique → Solde IR', () => {
    expect(getSoldeTaxLabel({ type: 'Personne physique' })).toBe('Solde IR');
  });
});

describe('SPEC §10.5 — sanitizePdfSegment', () => {
  it('retire N° et /', () => {
    expect(sanitizePdfSegment('N° 0001/2026/01')).toBe('0001-2026-01');
  });
  it('fallback', () => {
    expect(sanitizePdfSegment('', 'fallback')).toBe('fallback');
  });
});
