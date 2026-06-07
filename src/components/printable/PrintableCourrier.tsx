// SPEC_LOVABLE.md §9.10 — Rendu imprimable du courrier
import { forwardRef } from 'react';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import {
  COURRIER_STATUT_BADGE,
  COURRIER_STATUT_LABEL,
  type CourrierStatut,
} from '@/lib/spec/courrierStatut';
import SignatureBlock from './SignatureBlock';
import PrismaFooter from './PrismaFooter';

export interface CourrierPrintData {
  ref: string;
  date: string;
  destinataire: string;
  destinataireAdresse: string;
  civiliteDestinataire?: 'Madame' | 'Monsieur';
  objet: string;
  corps: string;
  pj: string;
  statut?: CourrierStatut;
}

interface Props {
  data: CourrierPrintData;
  config: CabinetConfig;
}

function paragraphsFromCorps(corps: string): string[] {
  if (!corps) return [];
  return corps.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

function piecesJointes(pj: string): string[] {
  if (!pj) return [];
  return pj.split(/\r?\n/).map((s) => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
}

const PrintableCourrier = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateFr = new Date(data.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const civilite = data.civiliteDestinataire ?? '';
  const paragraphs = paragraphsFromCorps(data.corps);
  const pjs = piecesJointes(data.pj);

  return (
    <div
      ref={ref}
      className="prisma-printable print-area bg-white max-w-4xl mx-auto"
      style={{
        fontFamily: "'Inter', sans-serif",
        color: '#111827',
        padding: '1cm 2cm 0.7cm 2cm',
      }}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between pb-3" style={{ borderBottom: '1px solid #1e3a8a' }}>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{config.nomCabinet}</h1>
          <p className="text-xs text-gray-700">{config.slogan}</p>
          <p className="text-xs text-gray-600 mt-1">Siège Social : {config.siege}</p>
          <p className="text-xs text-gray-600">Tél : {config.telephone}</p>
          <p className="text-xs text-gray-600">N.I.U : {config.niu}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-700"><strong>Réf :</strong> {data.ref}</p>
          <p className="text-xs text-gray-700">Yaoundé, le {dateFr}</p>
          {data.statut && (
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${COURRIER_STATUT_BADGE[data.statut]}`}>
              {COURRIER_STATUT_LABEL[data.statut]}
            </span>
          )}
        </div>
      </div>

      {/* Destinataire (aligné droite) */}
      <div className="text-right my-6">
        {civilite && <p className="text-sm">À l'attention de {civilite}</p>}
        <p className="font-bold text-base" style={{ color: '#1e3a8a' }}>{data.destinataire}</p>
        {data.destinataireAdresse && (
          <p className="text-sm text-gray-700 whitespace-pre-line">{data.destinataireAdresse}</p>
        )}
      </div>

      {/* Objet */}
      <div
        className="my-4 p-3 rounded"
        style={{
          backgroundColor: '#f0f9ff',
          borderLeft: '4px solid #1e3a8a',
        }}
      >
        <p style={{ fontSize: '14pt', fontWeight: 600, color: '#1e3a8a' }}>
          <span className="uppercase tracking-wide">Objet : </span>{data.objet}
        </p>
      </div>

      {/* Corps */}
      <div
        style={{
          fontSize: '13.5pt',
          lineHeight: 1.8,
          textAlign: 'justify',
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: '1rem', whiteSpace: 'pre-line' }}>{p}</p>
        ))}
      </div>

      {/* Pièces jointes */}
      {pjs.length > 0 && (
        <div className="mt-6 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
          <p className="text-sm font-semibold" style={{ color: '#1e3a8a' }}>Pièces jointes :</p>
          <ul style={{ fontSize: '0.8rem', listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
            {pjs.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <SignatureBlock config={config} alignment="right" />
      <PrismaFooter />
    </div>
  );
});

PrintableCourrier.displayName = 'PrintableCourrier';
export default PrintableCourrier;
