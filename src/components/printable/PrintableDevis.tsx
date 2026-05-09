// SPEC_LOVABLE.md §6.5 — Rendu imprimable du devis (identique facture + bandeau jaune)
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { formatMoney } from '@/lib/spec/fiscal';
import type { Prestation } from '@/lib/spec/facturePrestations';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import PrismaHeader from './PrismaHeader';
import SignatureBlock from './SignatureBlock';
import PrismaFooter from './PrismaFooter';
import ClientCard from './ClientCard';

export type DevisStatus = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'converti';

const STATUS_LABEL: Record<DevisStatus, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
  converti: 'Converti',
};
const STATUS_COLORS: Record<DevisStatus, string> = {
  brouillon: 'bg-gray-100 text-gray-800',
  envoye: 'bg-blue-100 text-blue-800',
  accepte: 'bg-green-100 text-green-800',
  refuse: 'bg-red-100 text-red-800',
  converti: 'bg-violet-100 text-violet-800',
};

export interface DevisPrintData {
  number: string;
  date: string;
  status: DevisStatus;
  client: ClientSpec;
  prestations: Prestation[];
  totalImpots: number;
  totalHonoraires: number;
  total: number;
}

interface Props {
  data: DevisPrintData;
  config: CabinetConfig;
}

const PrintableDevis = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
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
        rightTitle="DEVIS / PROFORMA"
        rightSubtitle={`Date : ${dateFr}`}
        rightExtra={
          <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[data.status]}`}>
            {STATUS_LABEL[data.status]}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          className="p-4 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
        >
          <p className="text-xs uppercase tracking-wide opacity-90">Numéro de devis</p>
          <p className="text-2xl font-bold mt-1">{data.number}</p>
        </div>
        <ClientCard client={data.client} title="Adressé à :" />
      </div>

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
              Total devis
            </td>
            <td className="p-3 text-right font-bold text-lg">{formatMoney(data.total)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-3 rounded" style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #1e3a8a' }}>
          <p className="text-xs text-gray-600 uppercase tracking-wide">Total Impôts</p>
          <p className="font-bold text-lg" style={{ color: '#1e3a8a' }}>{formatMoney(data.totalImpots)}</p>
        </div>
        <div className="p-3 rounded" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
          <p className="text-xs text-gray-600 uppercase tracking-wide">Total Honoraires</p>
          <p className="font-bold text-lg" style={{ color: '#166534' }}>{formatMoney(data.totalHonoraires)}</p>
        </div>
      </div>

      {/* Conditions du devis (bandeau jaune) */}
      <div
        className="mt-6 p-4 rounded"
        style={{ backgroundColor: '#fefce8', borderLeft: '4px solid #ca8a04' }}
      >
        <p className="font-bold uppercase text-sm tracking-wide" style={{ color: '#854d0e' }}>
          Conditions du devis
        </p>
        <p className="text-sm mt-2">
          <strong>Validité :</strong> Ce devis est valable 30 jours à compter de sa date d'émission.
        </p>
        <p className="text-sm">
          <strong>Moyen de paiement :</strong> {config.numerosPaiement}
        </p>
        <p className="text-xs italic text-gray-700 mt-2">
          Ce devis ne constitue pas une facture et n'engage le client qu'après acceptation formelle.
        </p>
      </div>

      {/* Bon pour accord + signature */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="font-semibold mb-2" style={{ color: '#1e3a8a' }}>Bon pour accord</p>
          <div
            style={{
              border: '1px dashed #9ca3af',
              borderRadius: '4px',
              minHeight: '90px',
              padding: '0.5rem',
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            Date : ________________________<br />
            Signature client (précédée de la mention « Bon pour accord ») :
          </div>
        </div>
        <SignatureBlock config={config} alignment="right" />
      </div>

      <PrismaFooter />
    </div>
  );
});

PrintableDevis.displayName = 'PrintableDevis';
export default PrintableDevis;
