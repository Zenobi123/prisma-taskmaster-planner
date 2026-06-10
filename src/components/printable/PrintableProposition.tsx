// Rendu imprimable de la PROPOSITION DE PAIEMENT — PORT FIDÈLE de avance-app.html / displayProposal().
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { getCiviliteLongue } from '@/lib/spec/fiscal';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';

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

const fr = (n: number) => Math.round(n || 0).toLocaleString('fr-FR');

const PrintableProposition = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateStr = new Date(data.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const civilite = getCiviliteLongue(data.client.civilite);
  const fiscal = data.lignes.filter((l) => l.type === 'Impôt');
  const honoraires = data.lignes.filter((l) => l.type === 'Honoraire');

  const ligneRow = (l: LigneProposition, key: string) => (
    <tr key={key}>
      <td className="border border-gray-300 px-3 py-2">
        <strong>{l.designation}</strong>
      </td>
      <td className="border border-gray-300 px-3 py-2 text-right">{fr(l.base)}</td>
      <td className="border border-gray-300 px-3 py-2 text-center">{l.fraction}%</td>
      <td className="border border-gray-300 px-3 py-2 text-right font-bold text-blue-900">{fr(l.amount)}</td>
    </tr>
  );

  return (
    <div
      ref={ref}
      className="prisma-printable"
      style={{ padding: '2rem', background: '#fff', maxWidth: '210mm', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      {/* En-tête */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold text-blue-900">{config.nomCabinet}</h1>
          <p className="text-gray-600 uppercase tracking-widest" style={{ fontSize: '13pt' }}>{config.slogan}</p>
          <div className="mt-1 text-gray-700" style={{ fontSize: '13pt' }}>
            <p>Siège Social : {config.siege}</p>
            <p>Tél : {config.telephone}</p>
            <p>N.I.U : {config.niu}</p>
          </div>
        </div>
        <div className="text-right text-gray-600" style={{ fontSize: '14pt' }}>
          <p>Yaoundé, le {dateStr}</p>
        </div>
      </div>

      <div style={{ borderBottom: '2px solid #1e3a8a', marginBottom: '2rem' }} />

      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-blue-900 uppercase">PROPOSITION DE PAIEMENT</h2>
      </div>

      <div className="mb-4 ml-auto" style={{ width: '50%' }}>
        <p className="font-bold text-sm">À l'attention de {civilite} :</p>
        <p className="text-base">{data.client.name}</p>
        {data.client.niu && (
          <p className="text-gray-600" style={{ fontSize: '12pt' }}>NIU : {data.client.niu}</p>
        )}
      </div>

      <table className="w-full border-collapse" style={{ margin: '1.5rem 0' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
            <th className="border border-gray-300 px-3 py-2 text-left">Désignation</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Base annuelle</th>
            <th className="border border-gray-300 px-3 py-2 text-center">Fraction à payer</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Montant à Verser</th>
          </tr>
        </thead>
        <tbody>
          {fiscal.length > 0 && (
            <>
              <tr style={{ backgroundColor: '#dbeafe', color: '#1e3a8a', fontWeight: 'bold' }}>
                <td colSpan={4} className="border border-gray-300 px-3 py-2">IMPÔTS</td>
              </tr>
              {fiscal.map((l, i) => ligneRow(l, `i${i}`))}
            </>
          )}
          {honoraires.length > 0 && (
            <>
              <tr style={{ backgroundColor: '#dbeafe', color: '#1e3a8a', fontWeight: 'bold' }}>
                <td colSpan={4} className="border border-gray-300 px-3 py-2">HONORAIRES</td>
              </tr>
              {honoraires.map((l, i) => ligneRow(l, `h${i}`))}
            </>
          )}
          <tr style={{ backgroundColor: '#f3f4f6', fontWeight: 'bold' }}>
            <td colSpan={2} className="border border-gray-300 px-3 py-2 text-gray-600 uppercase">TOTAL À PAYER</td>
            <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right text-xl text-blue-900">
              {fr(data.total)} F CFA
            </td>
          </tr>
        </tbody>
      </table>

      {data.note && <p className="text-xs text-gray-500 italic mt-2">* Note : {data.note}</p>}

      {/* Signature */}
      <div className="mt-8 flex justify-end">
        <div className="flex items-center gap-4">
          {config.cachet && <img src={config.cachet} alt="Cachet" style={{ maxHeight: '70px' }} />}
          <div className="text-center">
            <p className="font-bold text-blue-900">Pour {config.nomCabinet}</p>
            {config.signature && (
              <img src={config.signature} alt="Signature" style={{ maxHeight: '50px', margin: '0.5rem auto' }} />
            )}
            <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '0.25rem', marginTop: '0.5rem' }}>
              <p className="font-bold">{config.signataireNom}</p>
              <p className="text-sm text-gray-600">{config.signataireTitre}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{ marginTop: '2rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>
          <span style={{ fontWeight: 600, color: '#1e3a8a' }}>PRISMA Manager</span> — PRISMA GESTION : L'expertise
          qui sécurise votre gestion.
        </p>
      </div>
    </div>
  );
});

PrintableProposition.displayName = 'PrintableProposition';
export default PrintableProposition;
