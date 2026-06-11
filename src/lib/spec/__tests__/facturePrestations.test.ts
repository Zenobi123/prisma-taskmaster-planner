// Classification Impôt / Honoraire — référence : facturation/devis.html
// (LISTE_IMPOTS lignes 395-412, HONORAIRES_COMMUNS lignes 415-421).
// ACF et ATTIM (timbre fiscal 2 100 F) sont des IMPÔTS, comme les entrées CGA.
import { describe, it, expect } from 'vitest';
import {
  LISTE_IMPOTS,
  HONORAIRES_COMMUNS,
  HONORAIRES_PAR_REGIME,
  PRESTATIONS_COMMUNES,
} from '../facturePrestations';

const designations = (list: Array<{ designation: string }>) => list.map((i) => i.designation);

describe('Classification des prestations (référence devis.html)', () => {
  it('ACF et ATTIM sont classées en IMPÔTS (2 100 F)', () => {
    const acf = LISTE_IMPOTS.find((i) => i.designation.includes('ACF'));
    const attim = LISTE_IMPOTS.find((i) => i.designation.includes('ATTIM'));
    expect(acf).toBeDefined();
    expect(acf?.designation).toBe('Obtention ACF (Attestation de Conformité Fiscale)');
    expect(acf?.montant).toBe(2100);
    expect(attim).toBeDefined();
    expect(attim?.designation).toBe('Obtention ATTIM (Attestation Immatriculation)');
    expect(attim?.montant).toBe(2100);
  });

  it("ACF et ATTIM ne figurent PAS dans les honoraires", () => {
    const hono = designations(HONORAIRES_COMMUNS).join(' | ');
    expect(hono).not.toContain('ACF');
    expect(hono).not.toContain('ATTIM');
  });

  it('LISTE_IMPOTS reprend exactement la liste du devis vanilla (17 entrées, CGA inclus)', () => {
    expect(designations(LISTE_IMPOTS)).toEqual([
      'Précompte sur Loyer (PSL)',
      'Bail Commercial',
      'Taxe Foncière (TPF)',
      'Impôt Général Synthétique (IGS)',
      'Taxe de Développement Local (TDL)',
      'Solde IR',
      'Patente',
      'Impôt sur le Revenu des Personnes Physiques (IRPP)',
      'Taxe sur la Valeur Ajoutée (TVA)',
      'Acompte Impôt sur les Sociétés (AIS)',
      'Contribution au Crédit Foncier (CCF)',
      'Centimes Additionnels Communaux (CAC)',
      'Redevance Audiovisuelle (RAV)',
      'Obtention ACF (Attestation de Conformité Fiscale)',
      'Obtention ATTIM (Attestation Immatriculation)',
      'Inscription au Centre de Gestion Agréé',
      'Cotisation Annuelle au CGA',
    ]);
  });

  it('HONORAIRES_COMMUNS reprend exactement la liste du devis vanilla (5 entrées)', () => {
    expect(HONORAIRES_COMMUNS).toEqual([
      { designation: 'Déclaration Annuelle des Revenus des Particuliers (DARP)', montant: 5000 },
      { designation: 'Déclaration des Bénéficiaires Effectifs (DBEF)', montant: 5000 },
      { designation: 'Conseil fiscal', montant: 25000 },
      { designation: "Création d'entreprise", montant: 75000 },
      { designation: 'Modification statutaire', montant: 50000 },
    ]);
  });

  it('PRESTATIONS_COMMUNES : ACF/ATTIM typées Impôt, DARP/DBEF typées Honoraire', () => {
    const byDesignation = new Map(PRESTATIONS_COMMUNES.map((p) => [p.designation, p.type]));
    expect(byDesignation.get('Obtention ACF (Attestation de Conformité Fiscale)')).toBe('Impôt');
    expect(byDesignation.get('Obtention ATTIM (Attestation Immatriculation)')).toBe('Impôt');
    expect(byDesignation.get('Déclaration Annuelle des Revenus des Particuliers (DARP)')).toBe('Honoraire');
    expect(byDesignation.get('Déclaration des Bénéficiaires Effectifs (DBEF)')).toBe('Honoraire');
  });

  it('Honoraires par régime conformes au vanilla (montants Réel vs IGS)', () => {
    expect(HONORAIRES_PAR_REGIME.Reel).toContainEqual({ designation: 'Montage et mise en ligne DSF', montant: 100000 });
    expect(HONORAIRES_PAR_REGIME.IGS).toContainEqual({ designation: 'Montage et mise en ligne DSF', montant: 30000 });
    expect(HONORAIRES_PAR_REGIME.NonPro).toHaveLength(2);
    expect(HONORAIRES_PAR_REGIME.OBNL).toHaveLength(3);
  });
});
