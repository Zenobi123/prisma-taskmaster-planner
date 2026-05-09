// SPEC_LOVABLE.md §5.12 / §6.5 / §7.3 / §8.4 / §9.10 — En-tête commun
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';

interface Props {
  config: CabinetConfig;
  rightTitle: string;          // "FACTURE", "DEVIS / PROFORMA", "REÇU DE PAIEMENT", etc.
  rightSubtitle?: string;      // Date / Réf, etc.
  rightExtra?: React.ReactNode;
}

export default function PrismaHeader({ config, rightTitle, rightSubtitle, rightExtra }: Props) {
  return (
    <div className="flex items-start justify-between pb-4 border-b-2" style={{ borderColor: '#1e3a8a' }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>{config.nomCabinet}</h1>
        <p className="text-sm text-gray-700">{config.slogan}</p>
        <p className="text-xs text-gray-600 mt-1">Siège Social : {config.siege}</p>
        <p className="text-xs text-gray-600">Tél : {config.telephone}</p>
        <p className="text-xs text-gray-600">N.I.U : {config.niu}</p>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>{rightTitle}</h2>
        {rightSubtitle && <p className="text-sm text-gray-700 mt-1">{rightSubtitle}</p>}
        {rightExtra}
      </div>
    </div>
  );
}
