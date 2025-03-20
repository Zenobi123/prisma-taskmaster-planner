
import { Client } from "@/types/facture";

interface ClientInfoDisplayProps {
  client: Client | undefined;
}

const ClientInfoDisplay = ({ client }: ClientInfoDisplayProps) => {
  if (!client) {
    return (
      <div className="bg-gray-100 p-2 rounded-md border border-dashed border-gray-300 text-gray-600 italic text-sm mt-2">
        <p>Sélectionnez un client</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-2 rounded-md border border-gray-300 shadow-sm mt-2 text-sm">
      <p className="font-medium">{client.nom}</p>
      <p className="text-xs mt-1"><strong>Contact:</strong> {client.telephone}</p>
      <p className="text-xs"><strong>Adresse:</strong> {client.adresse}</p>
    </div>
  );
};

export default ClientInfoDisplay;
