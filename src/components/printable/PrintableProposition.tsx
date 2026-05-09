// SPEC_LOVABLE.md §7.3 — Rendu imprimable de la proposition de paiement
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { formatMoney, getCiviliteLongue } from '@/lib/spec/fiscal';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import SignatureBlock from './SignatureBlock';
import PrismaFooter from './PrismaFooter';
import PrismaHeader from './PrismaHeader';

export interface LigneProposition {
  type: 'Impôt' | 'Honoraire';
  designation: string;
  base: number;
  fraction: number;
  amount: number;
}

export interface PropositionPrintData {
  date: string;
  client: ClientSpec;
  lignes: LigneProposition[];
  totalImpots: number;
  totalHonoraires: number;
  total: number;
  note?: string;
}

interface Props {
  data: PropositionPrintData;
  config: CabinetConfig;
}

const PrintableProposition = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateFr = new Date(data.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const lignesImpots = data.lignes.filter((l) => l.type === 'Impôt');
  const lignesHonoraires = data.lignes.filter((l) => l.type === 'Honoraire');
  const civilite = getCiviliteLongue(data.client.civilite);

  return (
    <div
      ref={ref}
      className="prisma-printable print-area p-8 bg-white max-w-4xl mx-auto"
      style={{ fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      <PrismaHeader
        config={config}
        rightTitle=""
        rightSubtitle={`Yaoundé, le ${dateFr}`}
      />

      <div className="text-center my-8 py-4" style={{ borderTop: '2px solid #1e3a8a', borderBottom: '2px solid #1e3a8a' }}>
        <h2 className="text-2xl font-bold tracking-wide" style={{ color: '#1e3a8a' }}>
          PROPOSITION DE PAIEMENT
        </h2>
      </div>

      <div className="text-right mb-6">
        <p className="text-sm font-medium">À l'attention de {civilite} :</p>
        <p className="font-bold text-base" style={{ color: '#1e3a8a' }}>{data.client.name}</p>
        <p className="text-xs text-gray-700">NIU : {data.client.niu || '—'}</p>
      </div>

      <table className="w-full border-collapse" style={{ fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
            <th className="p-2 text-left">Désignation</th>
            <th className="p-2 text-right" style={{ width: '140px' }}>Base annuelle</th>
            <th className="p-2 text-right" style={{ width: '140px' }}>Fraction à payer</th>
            <th className="p-2 text-right" style={{ width: '160px' }}>Montant à verser</th>
          </tr>
        </thead>
        <tbody>
          {lignesImpots.length > 0 && (
            <>
              <tr>
                <td colSpan={4} className="p-2 prisma-section-impots">IMPÔTS</td>
              </tr>
              {lignesImpots.map((l, i) => (
                <tr key={`i${i}`} className="border-b border-gray-200">
                  <td className="p-2">{l.designation}</td>
                  <td className="p-2 text-right">{formatMoney(l.base)}</td>
                  <td className="p-2 text-right">{l.fraction} %</td>
                  <td className="p-2 text-right font-medium">{formatMoney(l.amount)}</td>
                </tr>
              ))}
            </>
          )}
          {lignesHonoraires.length > 0 && (
            <>
              <tr>
                <td colSpan={4} className="p-2 prisma-section-honoraires">HONORAIRES</td>
              </tr>
              {lignesHonoraires.map((l, i) => (
                <tr key={`h${i}`} className="border-b border-gray-200">
                  <td className="p-2">{l.designation}</td>
                  <td className="p-2 text-right">{formatMoney(l.base)}</td>
                  <td className="p-2 text-right">{l.fraction} %</td>
                  <td className="p-2 text-right font-medium">{formatMoney(l.amount)}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <td colSpan={3} className="p-3 text-right font-bold uppercase tracking-wide">Total à payer</td>
            <td className="p-3 text-right font-bold text-lg" style={{ color: '#1e3a8a' }}>
              {formatMoney(data.total)}
            </td>
          </tr>
        </tfoot>
      </table>

      {data.note && (
        <p className="mt-4 text-sm italic">
          <span className="font-semibold">* Note :</span> {data.note}
        </p>
      )}

      <SignatureBlock config={config} />
      <PrismaFooter />
    </div>
  );
});

PrintableProposition.displayName = 'PrintableProposition';
export default PrintableProposition;
