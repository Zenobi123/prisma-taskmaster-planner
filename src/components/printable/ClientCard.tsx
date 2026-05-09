// Carte "Facturé à / Reçu de / À l'attention de" commune
import type { ClientSpec } from '@/lib/spec/fiscal';

interface Props {
  client: ClientSpec;
  title?: string;
  showContact?: boolean;
}

export default function ClientCard({ client, title = 'Facturé à :', showContact = true }: Props) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        backgroundColor: '#f0f9ff',
        borderLeft: '4px solid #1e3a8a',
      }}
    >
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
      <p className="font-bold text-base mt-1" style={{ color: '#1e3a8a' }}>{client.name}</p>
      {client.niu && <p className="text-xs text-gray-700">NIU : {client.niu}</p>}
      {(client.ville || client.quartier) && (
        <p className="text-xs text-gray-700">
          {client.ville}{client.ville && client.quartier ? ' - ' : ''}{client.quartier}
        </p>
      )}
      {showContact && client.contact && (
        <p className="text-xs text-gray-700">Contact : {client.civilite} {client.contact}</p>
      )}
      {client.phone && <p className="text-xs text-gray-700">Tél : {client.phone}</p>}
    </div>
  );
}
