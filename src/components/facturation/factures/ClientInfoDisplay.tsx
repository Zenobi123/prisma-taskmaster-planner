
import { Client } from "@/types/facture";

interface ClientInfoDisplayProps {
  client: Client | undefined;
}

const ClientInfoDisplay = ({ client }: ClientInfoDisplayProps) => {
  if (!client) {
    return (
      <div className="bg-gray-50 p-2 rounded-md border border-dashed border-gray-300 text-gray-600 italic text-sm mt-1">
        <p>Sélectionnez un client</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-2 rounded-md border border-gray-300 shadow-sm mt-1 text-xs">
      <p className="font-medium text-sm">
        {client.type === "physique" 
          ? client.nom 
          : client.raisonsociale || client.nom}
      </p>
      <p className="mt-0.5">
        <strong>NIU:</strong> {client.niu}
      </p>
      <p>
        <strong>Contact:</strong> {client.contact?.telephone || 'N/A'}
      </p>
      <p>
        <strong>Adresse:</strong> {client.adresse?.quartier}, {client.adresse?.ville}
      </p>
    </div>
  );
};

export default ClientInfoDisplay;
