
import { Client } from "@/types/client";

interface ClientInfoSectionProps {
  client: Partial<Client>;
}

const ClientInfoSection = ({ client }: ClientInfoSectionProps) => {
  return (
    <dl className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">Nom</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {client.nom || "N/A"}
        </dd>
      </div>
      
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">Type</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
          {client.type || "N/A"}
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
          {client.adresse ? 
            `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}, ${client.adresse.lieuDit || ''}` : "N/A"}
        </dd>
      </div>
      
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">
          Contact
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          {client.contact ? 
            `${client.contact.telephone || ''} ${client.contact.email ? '| ' + client.contact.email : ''}` : "N/A"}
        </dd>
      </div>
    </dl>
  );
};

export default ClientInfoSection;
