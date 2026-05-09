// SPEC_LOVABLE.md §8.4 — Rendu imprimable du reçu de paiement
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { formatMoney } from '@/lib/spec/fiscal';
import { montantEnLettres } from '@/utils/numberToWords';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import SignatureBlock from './SignatureBlock';
import PrismaFooter from './PrismaFooter';
import ClientCard from './ClientCard';

export type RecuPaymentMode = 'Espèces' | 'Virement bancaire' | 'Mobile Money' | 'Chèque';

export interface RecuPrintData {
  number: string;
  date: string;
  client: ClientSpec;
  montant: number;
  montantImpots: number;
  montantHonoraires: number;
  paymentMode: RecuPaymentMode;
  motif: string;
}

interface Props {
  data: RecuPrintData;
  config: CabinetConfig;
}

const PrintableRecu = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateFr = new Date(data.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const lettres = montantEnLettres(data.montant);

  return (
    <div
      ref={ref}
      className="prisma-printable print-area p-8 bg-white max-w-4xl mx-auto"
      style={{
        fontFamily: "'Inter', sans-serif",
        color: '#111827',
        border: '3px double #1e3a8a',
      }}
    >
      {/* Bandeau dégradé pleine largeur */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          padding: '1.5rem 2rem',
          margin: '-2rem -2rem 2rem -2rem',
          textAlign: 'center',
        }}
      >
        <h2 className="text-2xl font-bold tracking-wide">REÇU DE PAIEMENT</h2>
        <p className="text-base mt-1">N° {data.number}</p>
      </div>

      <p className="text-right text-sm mb-6">Yaoundé, le {dateFr}</p>

      <ClientCard client={data.client} title="Reçu de :" showContact={false} />

      {/* La somme de */}
      <div
        className="mt-6 p-6 rounded text-center"
        style={{ backgroundColor: '#f0fdf4', border: '2px solid #16a34a' }}
      >
        <p className="text-sm text-gray-700 uppercase tracking-wide">La somme de :</p>
        <p className="text-3xl font-bold mt-2" style={{ color: '#1e3a8a' }}>
          {formatMoney(data.montant)}
        </p>
        <p className="text-sm italic text-gray-700 mt-1">({lettres})</p>
      </div>

      {/* Ventilation */}
      {(data.montantImpots > 0 || data.montantHonoraires > 0) && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded" style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #1e3a8a' }}>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Impôts</p>
            <p className="font-bold text-lg" style={{ color: '#1e3a8a' }}>{formatMoney(data.montantImpots)}</p>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Honoraires</p>
            <p className="font-bold text-lg" style={{ color: '#166534' }}>{formatMoney(data.montantHonoraires)}</p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <p className="text-sm">
          <strong className="uppercase tracking-wide" style={{ color: '#1e3a8a' }}>Mode de paiement :</strong>{' '}
          {data.paymentMode}
        </p>
        <hr className="border-gray-300" />
        <p className="text-sm">
          <strong className="uppercase tracking-wide" style={{ color: '#1e3a8a' }}>Motif du paiement :</strong>{' '}
        </p>
        <p className="text-sm pl-2">{data.motif}</p>
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-2 gap-4">
        <div className="text-xs text-gray-700">
          <p className="font-bold" style={{ color: '#1e3a8a' }}>{config.nomCabinet}</p>
          <p>{config.slogan}</p>
          <p>{config.siege}</p>
          <p>Tél : {config.telephone}</p>
          <p>N.I.U : {config.niu}</p>
        </div>
        <SignatureBlock config={config} />
      </div>

      <p className="text-xs italic text-gray-500 mt-6 text-center">
        Ce reçu est valable sans signature ni cachet en vertu de l'article 1316-4 du Code Civil.
      </p>

      <PrismaFooter />
    </div>
  );
});

PrintableRecu.displayName = 'PrintableRecu';
export default PrintableRecu;
