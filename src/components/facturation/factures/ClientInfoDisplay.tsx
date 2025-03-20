
import { Client } from "@/types/facture";

interface ClientInfoDisplayProps {
  client: Client | undefined;
}

const ClientInfoDisplay = ({ client }: ClientInfoDisplayProps) => {
  if (!client) {
    return (
      <div className="bg-gray-50 p-3 rounded-md border border-dashed text-gray-500 italic">
        <p>Sélectionnez un client pour afficher ses informations</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-3 rounded-md border">
      <p className="font-medium">{client.nom}</p>
      <p><strong>Contact:</strong> {client.telephone} | {client.email}</p>
      <p><strong>Adresse:</strong> {client.adresse}</p>
    </div>
  );
};

export default ClientInfoDisplay;
