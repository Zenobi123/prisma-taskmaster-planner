import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import PrintableFacture, { type FacturePrintData } from '../PrintableFacture';
import PrintableRecu, { type RecuPrintData } from '../PrintableRecu';
import PrintableDevis, { type DevisPrintData } from '../PrintableDevis';
import PrintableProposition, { type PropositionPrintData } from '../PrintableProposition';
import PrintableNote, { type NotePrintData } from '../PrintableNote';
import { DEFAULT_CABINET_CONFIG } from '@/lib/spec/cabinetConfig';
import {
  PAGE_STYLE_FACTURE,
  PAGE_STYLE_RECU,
  PAGE_STYLE_DEVIS,
  PAGE_STYLE_PROPOSITION,
  PAGE_STYLE_NOTE,
  PRINT_PAGE_FRAME_CSS,
} from '@/lib/spec/printStyles';
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

  it('Note explicative : objet, sections et totaux fidèles à note-app.html', () => {
    const data: NotePrintData = {
      number: 'N° 0001/2026/06',
      date: '2026-06-10',
      client,
      clientContact: 'M. TEMGOUA Bertin',
      lignes: [
        { type: 'Impôt', designation: 'IGS', montant: 50000 },
        { type: 'Honoraire', designation: 'Tenue de comptabilité', montant: 100000 },
      ],
      totalImpots: 50000,
      totalHonoraires: 100000,
    };
    const txt = text(<PrintableNote data={data} config={cfg} />);
    expect(txt).toContain("Objet : Note explicative relative à la Note d'honoraire N° 0001/2026/06");
    expect(txt).toContain('I. STRUCTURE DE LA FACTURATION');
    expect(txt).toContain("A. Les paiements d'obligations fiscales (Total : 50 000 F CFA)");
    expect(txt).toContain('B. Les honoraires pour prestations intellectuelles (Total : 100 000 F CFA)');
    expect(txt).toContain('II. MONTANT TOTAL');
    expect(txt).toContain('TOTAL GÉNÉRAL : 150 000 F CFA');
    // Civilité longue + contact débarrassé de son préfixe de civilité.
    expect(txt).toContain("À l'attention de Monsieur TEMGOUA Bertin");
    expect(txt).toContain('Veuillez agréer, Monsieur,');
    expect(txt).toContain('10 juin 2026');
  });
});

describe('Géométrie des marges (conteneurs « printArea » et @page du vanilla)', () => {
  const factureData: FacturePrintData = {
    number: 'N° 0001/2026/06',
    date: '2026-06-10',
    client,
    prestations: [],
    totalImpots: 0,
    totalHonoraires: 0,
    total: 0,
  };
  const recuData: RecuPrintData = {
    number: 'RECU-0001/2026',
    date: '2026-06-10',
    client,
    montant: 1000,
    montantImpots: 0,
    montantHonoraires: 0,
    paymentMode: 'Espèces',
    motif: 'Test',
  };
  const devisData: DevisPrintData = {
    number: 'DEVIS-0001/2026/06',
    date: '2026-06-10',
    status: 'brouillon',
    client,
    prestations: [{ type: 'Honoraire', designation: 'Mission', qty: 1, price: 1, total: 1 }],
    totalImpots: 0,
    totalHonoraires: 1,
    total: 1,
  };
  const propositionData: PropositionPrintData = {
    date: '2026-06-10',
    client,
    lignes: [{ type: 'Impôt', designation: 'IGS', base: 1, fraction: 25, amount: 1 }],
    totalImpots: 1,
    totalHonoraires: 0,
    total: 1,
  };

  it('Facture : carte max-w-4xl/p-8 (.prisma-print-page print-area) + @page 12/20mm', () => {
    const html = renderToStaticMarkup(<PrintableFacture data={factureData} config={cfg} />);
    expect(html).toContain('prisma-print-page print-area');
    // facture-app.html : <div class="max-w-4xl mx-auto bg-white p-8 print-area">
    expect(PRINT_PAGE_FRAME_CSS).toContain('max-width: 56rem');
    expect(PRINT_PAGE_FRAME_CSS).toContain('padding: 2rem');
    // printFacture() : @page 20mm 12mm 15mm 12mm, première page 12mm en haut.
    expect(PAGE_STYLE_FACTURE).toContain('@page { size: A4; margin: 20mm 12mm 15mm 12mm; }');
    expect(PAGE_STYLE_FACTURE).toContain('@page :first { margin: 12mm 12mm 15mm 12mm; }');
    // prisma-print.css : reset .print-area à l'impression.
    expect(PAGE_STYLE_FACTURE).toContain('--print-blue-strong: #c9dcfb');
  });

  it('Reçu : conteneur max-w-3xl p-8 + double bordure + @page 10mm', () => {
    const html = renderToStaticMarkup(<PrintableRecu data={recuData} config={cfg} />);
    expect(html).toContain('print-area');
    expect(html).toContain('max-w-3xl');
    expect(html).toContain('p-8');
    expect(html).toContain('3px double #1e3a8a');
    expect(PAGE_STYLE_RECU).toContain('@page { size: A4; margin: 10mm 10mm; }');
  });

  it('Devis : conteneur max-w-4xl p-5 + ligne total-row + @page 10mm', () => {
    const html = renderToStaticMarkup(<PrintableDevis data={devisData} config={cfg} />);
    expect(html).toContain('print-area');
    expect(html).toContain('max-w-4xl');
    expect(html).toContain('p-5');
    expect(html).toContain('total-row');
    expect(PAGE_STYLE_DEVIS).toContain('@page { size: A4; margin: 10mm 10mm; }');
  });

  it('Proposition : conteneur max-w-4xl p-8 + sections bg-section + @page 10mm', () => {
    const html = renderToStaticMarkup(<PrintableProposition data={propositionData} config={cfg} />);
    expect(html).toContain('print-area');
    expect(html).toContain('max-w-4xl');
    expect(html).toContain('p-8');
    expect(html).toContain('bg-section');
    expect(PAGE_STYLE_PROPOSITION).toContain('@page { size: A4; margin: 10mm 10mm; }');
  });

  it('Note explicative : conteneur max-w-4xl p-12 + @page 10mm', () => {
    const noteData: NotePrintData = {
      number: 'N° 0001/2026/06',
      date: '2026-06-10',
      client,
      lignes: [],
      totalImpots: 0,
      totalHonoraires: 0,
    };
    const html = renderToStaticMarkup(<PrintableNote data={noteData} config={cfg} />);
    expect(html).toContain('print-area');
    expect(html).toContain('max-w-4xl');
    expect(html).toContain('p-12');
    expect(PAGE_STYLE_NOTE).toContain('@page { size: A4; margin: 10mm 10mm; }');
  });
});
