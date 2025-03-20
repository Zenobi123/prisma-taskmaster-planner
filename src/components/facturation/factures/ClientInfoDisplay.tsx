
import { Client } from "@/types/facture";

interface ClientInfoDisplayProps {
  client: Client | undefined;
}

const ClientInfoDisplay = ({ client }: ClientInfoDisplayProps) => {
  if (!client) {
    return (
      <div className="bg-gray-100 p-4 rounded-md border border-dashed border-gray-300 text-gray-600 italic">
        <p>Sélectionnez un client pour afficher ses informations</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md border border-gray-300 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">Informations client</h3>
      <p className="font-medium text-lg">{client.nom}</p>
      <p className="mt-1"><strong>Contact:</strong> {client.telephone} | {client.email}</p>
      <p className="mt-1"><strong>Adresse:</strong> {client.adresse}</p>
    </div>
  );
};

export default ClientInfoDisplay;
