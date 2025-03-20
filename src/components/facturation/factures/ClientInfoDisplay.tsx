
import { Client } from "@/types/facture";

interface ClientInfoDisplayProps {
  client: Client | undefined;
}

const ClientInfoDisplay = ({ client }: ClientInfoDisplayProps) => {
  if (!client) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-md border">
      <p><strong>Contact:</strong> {client.telephone} | {client.email}</p>
      <p><strong>Adresse:</strong> {client.adresse}</p>
    </div>
  );
};

export default ClientInfoDisplay;
