// SPEC_LOVABLE.md §5.12 — Rendu imprimable de la facture
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { formatMoney } from '@/lib/spec/fiscal';
import type { Prestation } from '@/lib/spec/facturePrestations';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import PrismaHeader from './PrismaHeader';
import SignatureBlock from './SignatureBlock';
import PrismaFooter from './PrismaFooter';
import ClientCard from './ClientCard';

export interface FacturePrintData {
  number: string;
  date: string;
  client: ClientSpec;
  prestations: Prestation[];
  totalImpots: number;
  totalHonoraires: number;
  total: number;
}

interface Props {
  data: FacturePrintData;
  config: CabinetConfig;
}

const PrintableFacture = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateFr = new Date(data.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      ref={ref}
      className="prisma-printable print-area p-8 bg-white max-w-4xl mx-auto"
      style={{ fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      <PrismaHeader
        config={config}
        rightTitle="FACTURE"
        rightSubtitle={`Date : ${dateFr}`}
      />

      {/* Numéro + Facturé à */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          className="p-4 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
        >
          <p className="text-xs uppercase tracking-wide opacity-90">Numéro de facture</p>
          <p className="text-2xl font-bold mt-1">{data.number}</p>
        </div>
        <ClientCard client={data.client} title="Facturé à :" />
      </div>

      {/* Tableau prestations */}
      <table className="w-full mt-6 border-collapse" style={{ fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
            <th className="p-2 text-left" style={{ width: '40px' }}>N°</th>
            <th className="p-2 text-left">Désignation</th>
            <th className="p-2 text-right" style={{ width: '60px' }}>Qté</th>
            <th className="p-2 text-right" style={{ width: '120px' }}>P.U.</th>
            <th className="p-2 text-right" style={{ width: '140px' }}>Montant</th>
          </tr>
        </thead>
        <tbody>
          {data.prestations.map((p, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="p-2 text-gray-600">{i + 1}</td>
              <td className="p-2">
                <span className={p.type === 'Impôt' ? 'prisma-badge-impot' : 'prisma-badge-honoraire'}>
                  {p.type}
                </span>
                <span className="ml-2">{p.designation}</span>
              </td>
              <td className="p-2 text-right">{p.qty}</td>
              <td className="p-2 text-right">{formatMoney(p.price)}</td>
              <td className="p-2 text-right font-medium">{formatMoney(p.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
            <td colSpan={4} className="p-3 text-right font-bold uppercase tracking-wide">
              Total à payer
            </td>
            <td className="p-3 text-right font-bold text-lg">{formatMoney(data.total)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Sous-totaux Impôts / Honoraires */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div
          className="p-3 rounded"
          style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #1e3a8a' }}
        >
          <p className="text-xs text-gray-600 uppercase tracking-wide">Total Impôts</p>
          <p className="font-bold text-lg" style={{ color: '#1e3a8a' }}>
            {formatMoney(data.totalImpots)}
          </p>
        </div>
        <div
          className="p-3 rounded"
          style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' }}
        >
          <p className="text-xs text-gray-600 uppercase tracking-wide">Total Honoraires</p>
          <p className="font-bold text-lg" style={{ color: '#166534' }}>
            {formatMoney(data.totalHonoraires)}
          </p>
        </div>
      </div>

      {/* Informations de paiement */}
      <div
        className="mt-6 p-4 rounded"
        style={{ backgroundColor: '#fefce8', borderLeft: '4px solid #ca8a04' }}
      >
        <p className="font-bold uppercase text-sm tracking-wide" style={{ color: '#854d0e' }}>
          Informations de paiement
        </p>
        <p className="text-sm mt-2"><strong>Mode :</strong> {config.modePaiement}</p>
        <p className="text-sm"><strong>Numéros :</strong> {config.numerosPaiement}</p>
        <p className="text-sm"><strong>Échéance :</strong> {config.echeanceFacture}</p>
      </div>

      <SignatureBlock config={config} />
      <PrismaFooter />
    </div>
  );
});

PrintableFacture.displayName = 'PrintableFacture';
export default PrintableFacture;
