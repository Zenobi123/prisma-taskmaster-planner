// SPEC_LOVABLE.md §10.12 — Bloc signataire commun
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';

interface Props {
  config: CabinetConfig;
  alignment?: 'right' | 'center';
}

export default function SignatureBlock({ config, alignment = 'right' }: Props) {
  return (
    <div className={`mt-8 flex ${alignment === 'right' ? 'justify-end' : 'justify-center'}`}>
      <div className="flex items-end gap-4">
        {config.cachet && (
          <img
            src={config.cachet}
            alt="Cachet"
            style={{ maxHeight: '70px' }}
          />
        )}
        <div className="text-center">
          <p className="font-bold" style={{ color: '#1e3a8a' }}>Pour {config.nomCabinet}</p>
          {config.signature && (
            <img
              src={config.signature}
              alt="Signature"
              style={{ maxHeight: '50px', margin: '0.5rem auto' }}
            />
          )}
          <div style={{ borderTop: '2px solid #9ca3af', paddingTop: '0.5rem', marginTop: config.signature ? 0 : '2rem', minWidth: '200px' }}>
            <p className="font-bold">{config.signataireNom}</p>
            <p className="text-sm text-gray-600">{config.signataireTitre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
