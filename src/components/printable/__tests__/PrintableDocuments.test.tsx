import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import PrintableFacture, { type FacturePrintData } from '../PrintableFacture';
import PrintableRecu, { type RecuPrintData } from '../PrintableRecu';
import PrintableDevis, { type DevisPrintData } from '../PrintableDevis';
import PrintableProposition, { type PropositionPrintData } from '../PrintableProposition';
import { DEFAULT_CABINET_CONFIG } from '@/lib/spec/cabinetConfig';
import type { ClientSpec } from '@/lib/spec/fiscal';
import type { ReactElement } from 'react';

// Texte visible normalisé : retire <style>, balises, décode les entités et
// uniformise les espaces (insécables/étroits issus de toLocaleString).
const text = (el: ReactElement): string =>
  renderToStaticMarkup(el)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const client: ClientSpec = {
  id: 1,
  type: 'Personne morale',
  name: 'ENTREPRISE TEST SARL',
  niu: 'M0000000000A',
  cdi: '',
  ville: 'Yaoundé',
  quartier: 'Bastos',
  phone: '690000000',
  contact: '690000000',
  civilite: 'M.',
  secteur: '',
  externalise: 'Non',
  statut: 'Actif',
  modePaiementIGS: 'annuel',
  modePaiementPSL: 'annuel',
  createdAt: new Date().toISOString(),
};

const cfg = DEFAULT_CABINET_CONFIG;

describe('Rendus imprimables fidèles au vanilla', () => {
  it('Facture : libellés et formats conformes', () => {
    const data: FacturePrintData = {
      number: 'N° 0001/2026/06',
      date: '2026-06-10',
      client,
      prestations: [
        { type: 'Impôt', designation: 'IGS', qty: 1, price: 50000, total: 50000 },
        { type: 'Honoraire', designation: 'Tenue de comptabilité', qty: 1, price: 100000, total: 100000 },
      ],
      totalImpots: 50000,
      totalHonoraires: 100000,
      total: 150000,
    };
    const txt = text(<PrintableFacture data={data} config={cfg} />);

    expect(txt).toContain('FACTURE');
    // Date en toutes lettres (mois long), comme la référence.
    expect(txt).toContain('10 juin 2026');
    expect(txt).toContain('Prix Unitaire');
    expect(txt).toContain('TOTAL À PAYER');
    // Bloc paiement (libellé fidèle, pas « Mode : »).
    expect(txt).toContain('Mode de paiement :');
    // Ligne info au-dessus du tableau.
    expect(txt).toContain('Facture N° 0001/2026/06');
    // Montant ligne en « F », total/sous-totaux en « F CFA ».
    expect(txt).toContain('50 000 F');
    expect(txt).toContain('150 000 F CFA');
    expect(txt).toContain('Impôt');
    expect(txt).toContain('Honoraire');
  });

  it('Reçu : montant en lettres suffixé « francs CFA »', () => {
    const data: RecuPrintData = {
      number: 'RECU-0001/2026',
      date: '2026-06-10',
      client,
      montant: 150000,
      montantImpots: 50000,
      montantHonoraires: 100000,
      paymentMode: 'Mobile Money',
      motif: 'Règlement facture N° 0001/2026/06',
    };
    const txt = text(<PrintableRecu data={data} config={cfg} />);
    expect(txt).toContain('REÇU DE PAIEMENT');
    expect(txt).toContain('Reçu de :');
    expect(txt).toContain('francs CFA');
    expect(txt).toContain('150 000 F CFA');
  });

  it('Devis : en-tête, conditions et total fidèles', () => {
    const data: DevisPrintData = {
      number: 'DEVIS-0001/2026/06',
      date: '2026-06-10',
      status: 'brouillon',
      client,
      prestations: [{ type: 'Honoraire', designation: 'Mission', qty: 1, price: 200000, total: 200000 }],
      totalImpots: 0,
      totalHonoraires: 200000,
      total: 200000,
    };
    const txt = text(<PrintableDevis data={data} config={cfg} />);
    expect(txt).toContain('DEVIS / PROFORMA');
    expect(txt).toContain('Destinataire :');
    expect(txt).toContain('Conditions du devis');
    expect(txt).toContain('10 juin 2026');
    expect(txt).toContain('200 000 F CFA');
  });

  it('Proposition : titre et colonnes fidèles', () => {
    const data: PropositionPrintData = {
      date: '2026-06-10',
      client,
      lignes: [{ type: 'Impôt', designation: 'IGS', base: 500000, fraction: 25, amount: 125000 }],
      totalImpots: 125000,
      totalHonoraires: 0,
      total: 125000,
    };
    const txt = text(<PrintableProposition data={data} config={cfg} />);
    expect(txt).toContain('PROPOSITION DE PAIEMENT');
    expect(txt).toContain('attention de Monsieur');
    expect(txt).toContain('Base annuelle');
    expect(txt).toContain('125 000 F CFA');
  });
});
