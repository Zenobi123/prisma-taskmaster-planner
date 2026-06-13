// Rendu imprimable du COURRIER — PORT FIDÈLE de courrier-app.html / displayCourrier().
// Le markup et les styles inline reproduisent à l'identique le document vanilla
// (cf. STANDARD_PRESENTATION_COURRIERS.md).
import { forwardRef } from 'react';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import type { CourrierStatut } from '@/lib/spec/courrierStatut';

export interface CourrierPrintData {
  ref: string;
  date: string;
  destinataire: string;
  destinataireAdresse: string;
  civiliteDestinataire?: 'Madame' | 'Monsieur' | '';
  objet: string;
  corps: string;
  pj: string;
  statut?: CourrierStatut;
}

interface Props {
  data: CourrierPrintData;
  config: CabinetConfig;
}

// Badges de statut — styles inline VERBATIM du vanilla (displayCourrier).
const STATUT_BADGE: Record<CourrierStatut, { bg: string; color: string; label: string }> = {
  brouillon: { bg: '#fef3c7', color: '#92400e', label: 'BROUILLON' },
  envoye: { bg: '#dbeafe', color: '#1e40af', label: 'ENVOYÉ' },
  accuse: { bg: '#d1fae5', color: '#065f46', label: 'ACCUSÉ R.' },
  classe: { bg: '#e5e7eb', color: '#374151', label: 'CLASSÉ' },
};

// Découpage du corps en paragraphes sur les lignes vides (les retours simples
// sont conservés via white-space: pre-line, équivalent des <br> du vanilla).
function paragraphsFromCorps(corps: string): string[] {
  if (!corps) return [];
  return String(corps)
    .split(/\n\s*\n/)
    .filter((p) => p.trim());
}

// Pièces jointes : une par ligne, on retire la numérotation « 1. » comme le vanilla.
function piecesJointes(pj: string): string[] {
  if (!pj || !pj.trim()) return [];
  return pj
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.replace(/^\d+\.\s*/, ''));
}

const PrintableCourrier = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  // Date en format long « 13 juin 2026 » (identique au vanilla : year numeric,
  // month long, day numeric).
  const dateStr = new Date(data.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const civilite = data.civiliteDestinataire || '';
  const attentionLabel = civilite ? `À l'attention de ${civilite}` : `À l'attention de`;
  const paragraphs = paragraphsFromCorps(data.corps);
  const pjs = piecesJointes(data.pj);
  const badge = data.statut ? STATUT_BADGE[data.statut] : null;

  return (
    // Réplique du conteneur vanilla #printArea : la marge papier @page
    // (1cm 2cm 0.7cm 2cm) est simulée en aperçu par le padding du conteneur.
    <div
      ref={ref}
      className="prisma-printable print-area bg-white max-w-4xl mx-auto"
      style={{ padding: '1cm 2cm 0.7cm 2cm' }}
    >
      <div style={{ fontFamily: "'Inter', Arial, sans-serif", lineHeight: 1.65, color: '#1f2937' }}>
        {/* En-tête Cabinet */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.15rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
              {config.nomCabinet}
            </h1>
            <p
              style={{
                fontSize: '0.78rem',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.17em',
                margin: '0.15rem 0 0',
              }}
            >
              {config.slogan}
            </p>
            <div style={{ fontSize: '0.88rem', lineHeight: 1.55, marginTop: '0.65rem', color: '#4b5563' }}>
              <p style={{ margin: 0 }}>Siège Social : {config.siege}</p>
              <p style={{ margin: 0 }}>Tél : {config.telephone}</p>
              <p style={{ margin: 0 }}>N.I.U : {config.niu}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '0 0 0.45rem' }}>
              Réf : <strong>{data.ref}</strong>
            </p>
            <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '0 0 0.75rem' }}>
              Yaoundé, le {dateStr}
            </p>
            {badge && (
              <span
                style={{
                  background: badge.bg,
                  color: badge.color,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                {badge.label}
              </span>
            )}
          </div>
        </div>

        {/* Trait de séparation */}
        <div style={{ borderBottom: '2px solid #1e3a8a', marginBottom: '0.85rem' }} />

        {/* Destinataire */}
        <div style={{ textAlign: 'right', marginBottom: '1.05rem' }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em', margin: '0 0 0.2rem' }}>
            {attentionLabel}
          </p>
          <p style={{ fontWeight: 700, fontSize: '1.08rem', margin: 0 }}>{data.destinataire}</p>
          {data.destinataireAdresse && (
            <p style={{ fontSize: '0.95rem', color: '#4b5563', margin: '0.1rem 0 0', whiteSpace: 'pre-line' }}>
              {data.destinataireAdresse}
            </p>
          )}
        </div>

        {/* Objet */}
        <div
          style={{
            marginBottom: '0.95rem',
            padding: '0.9rem 1.1rem',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #1e3a8a',
            borderRadius: '0 6px 6px 0',
          }}
        >
          <p style={{ margin: 0, fontSize: '14pt', lineHeight: 1.45 }}>
            <strong>Objet :</strong> {data.objet}
          </p>
        </div>

        {/* Corps */}
        <div style={{ fontSize: '13.5pt', lineHeight: 1.8, textAlign: 'justify', marginBottom: '1rem' }}>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                margin: `0 0 ${i === paragraphs.length - 1 ? '0' : '0.65rem'}`,
                whiteSpace: 'pre-line',
              }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Pièces jointes */}
        {pjs.length > 0 && (
          <div style={{ marginTop: '1rem', paddingTop: '0.65rem', borderTop: '1px solid #d1d5db' }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pièces jointes :</p>
            <ul style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0, paddingLeft: '1.5rem' }}>
              {pjs.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Signature */}
        <div style={{ marginTop: '1.65rem', textAlign: 'right' }}>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
              {config.cachet && (
                <img src={config.cachet} alt="Cachet" style={{ maxHeight: '70px' }} />
              )}
              <div>
                <p style={{ fontWeight: 700, color: '#1e3a8a', margin: 0 }}>Pour {config.nomCabinet}</p>
                {config.signature && (
                  <img
                    src={config.signature}
                    alt="Signature"
                    style={{ maxHeight: '50px', display: 'block', margin: '0.5rem auto' }}
                  />
                )}
                <div style={{ borderTop: '2px solid #9ca3af', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{config.signataireNom}</p>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{config.signataireTitre}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div style={{ marginTop: '0.95rem', paddingTop: '0.4rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>
            <span style={{ fontWeight: 600, color: '#1e3a8a' }}>PRISMA Manager</span> — PRISMA GESTION :
            L'expertise qui sécurise votre gestion.
          </p>
        </div>
      </div>
    </div>
  );
});

PrintableCourrier.displayName = 'PrintableCourrier';
export default PrintableCourrier;
