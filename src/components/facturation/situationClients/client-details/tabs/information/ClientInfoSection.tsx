
import { Client } from "@/types/client";

interface ClientInfoSectionProps {
  client: Partial<Client>;
}

const ClientInfoSection = ({ client }: ClientInfoSectionProps) => {
  console.log("ClientInfoSection - Client data:", client);
  
  const getClientName = () => {
    if (client.type === "physique") {
      return client.nom || "N/A";
    } else {
      return client.raisonsociale || client.nom || "N/A";
    }
  };

  const getAddress = () => {
    if (!client.adresse) return "N/A";
    
    if (typeof client.adresse === 'object') {
      const addr = client.adresse as any;
      const parts = [
        addr.ville,
        addr.quartier,
        addr.lieuDit
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : "N/A";
    }
    
    return String(client.adresse) || "N/A";
  };

  const getContact = () => {
    if (!client.contact) return "N/A";
    
    if (typeof client.contact === 'object') {
      const contact = client.contact as any;
      const parts = [
        contact.telephone,
        contact.email
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(' | ') : "N/A";
    }
    
    return String(client.contact) || "N/A";
  };

  return (
    <dl className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">Nom</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {getClientName()}
        </dd>
      </div>
      
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">Type</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
          {client.type === "physique" ? "Personne physique" : client.type === "morale" ? "Personne morale" : "N/A"}
        </dd>
      </div>
      
      {client.type === "morale" && client.raisonsociale && (
        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Raison Sociale
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {client.raisonsociale}
          </dd>
        </div>
      )}
      
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">
          Numéro d'identification (NIU)
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {client.niu || "N/A"}
        </dd>
      </div>
      
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">
          Adresse
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {getAddress()}
        </dd>
      </div>
      
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">
          Contact
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {getContact()}
        </dd>
      </div>
    </dl>
  );
};

export default ClientInfoSection;
