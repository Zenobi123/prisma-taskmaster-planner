// Rendu imprimable du REÇU DE PAIEMENT — PORT FIDÈLE de recu-app.html / displayRecuFromData().
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { numberToWordsFr } from '@/utils/numberToWords';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';

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

const fCFA = (n: number) => `${Math.round(n || 0).toLocaleString('fr-FR')} F CFA`;

const PrintableRecu = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateStr = new Date(data.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const enLettres = numberToWordsFr(data.montant);
  const c = data.client;
  const villeLine = [c.ville, c.quartier].filter(Boolean).join(' - ');
  const hasVentilation = data.montantImpots > 0 || data.montantHonoraires > 0;

  return (
    <div
      ref={ref}
      className="prisma-printable"
      style={{ padding: '2rem', background: '#fff', maxWidth: '210mm', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      {/* Bandeau dégradé pleine largeur */}
      <div
        className="text-center mb-6"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          padding: '1.5rem',
          margin: '-2rem -2rem 2rem -2rem',
        }}
      >
        <h1 className="text-3xl font-bold">REÇU DE PAIEMENT</h1>
        <p className="text-lg mt-2">N° {data.number}</p>
      </div>

      <div className="mb-6 text-right">
        <p className="text-sm text-gray-600">Yaoundé, le {dateStr}</p>
      </div>

      {/* Reçu de */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-900">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Reçu de :</h2>
        <p className="text-xl font-bold">{c.name}</p>
        {c.niu && <p className="text-sm text-gray-700">NIU : {c.niu}</p>}
        {villeLine && <p className="text-sm text-gray-700">{villeLine}</p>}
      </div>

      {/* La somme de */}
      <div className="mb-6 text-center bg-green-50 p-6 rounded-lg border-2 border-green-700">
        <p className="text-gray-700 mb-2">La somme de :</p>
        <p className="text-4xl font-bold text-green-900 mb-2">{fCFA(data.montant)}</p>
        <p className="text-sm text-gray-600 italic">({enLettres} francs CFA)</p>
      </div>

      {/* Ventilation Impôts / Honoraires */}
      {hasVentilation && (
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
            <p className="text-xs text-blue-800 font-semibold">Impôts</p>
            <p className="text-lg font-bold text-blue-900">{fCFA(data.montantImpots)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-600">
            <p className="text-xs text-green-800 font-semibold">Honoraires</p>
            <p className="text-lg font-bold text-green-900">{fCFA(data.montantHonoraires)}</p>
          </div>
        </div>
      )}

      {/* Mode + Motif */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Mode de paiement :</span>
          <span className="text-gray-900">{data.paymentMode}</span>
        </div>
        <div className="border-b pb-2">
          <p className="font-semibold text-gray-700 mb-1">Motif du paiement :</p>
          <p className="text-gray-900">{data.motif}</p>
        </div>
      </div>

      {/* Pied : cabinet + signature */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-blue-900 text-lg">{config.nomCabinet}</p>
            <p className="text-xs text-gray-600">{config.slogan}</p>
            <p className="text-xs text-gray-600 mt-2">{config.siege}</p>
            <p className="text-xs text-gray-600">Tél : {config.telephone}</p>
            <p className="text-xs text-gray-600">N.I.U : {config.niu}</p>
          </div>
          <div className="flex items-center gap-4">
            {config.cachet && <img src={config.cachet} alt="Cachet" style={{ maxHeight: '70px' }} />}
            <div className="text-center">
              {config.signature && (
                <img src={config.signature} alt="Signature" style={{ maxHeight: '50px', margin: '0 auto' }} />
              )}
              <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '0.25rem', marginTop: '0.5rem' }}>
                <p className="font-bold">{config.signataireNom}</p>
                <p className="text-sm text-gray-600">{config.signataireTitre}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500 italic">
        Ce reçu est valable sans signature ni cachet en vertu de l'article 1316-4 du Code Civil
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>
          <span style={{ fontWeight: 600, color: '#1e3a8a' }}>PRISMA Manager</span> — PRISMA GESTION : L'expertise
          qui sécurise votre gestion.
        </p>
      </div>
    </div>
  );
});

PrintableRecu.displayName = 'PrintableRecu';
export default PrintableRecu;
