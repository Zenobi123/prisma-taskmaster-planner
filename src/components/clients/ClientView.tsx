
import { Client } from "@/types/client";
import { GeneralInfoCard } from "./view/GeneralInfoCard";
import { AddressCard } from "./view/AddressCard";
import { ContactCard } from "./view/ContactCard";
import { InteractionsCard } from "./view/InteractionsCard";
import { CapitalSocialSection } from "./capital/CapitalSocialSection";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  console.log("=== ClientView DEBUT ===");
  console.log("ClientView - Type de client:", client.type);
  console.log("ClientView - Type exacte:", typeof client.type);
  console.log("ClientView - Comparaison stricte:", client.type === 'morale');
  console.log("ClientView - Client complet:", client);
  console.log("=== ClientView FIN ===");

  const isPersonneMorale = client.type === 'morale';
  console.log("isPersonneMorale:", isPersonneMorale);

  return (
    <div className="space-y-6">
      <GeneralInfoCard client={client} />
      <div className="grid md:grid-cols-2 gap-6">
        <AddressCard client={client} />
        <ContactCard client={client} />
      </div>
      
      {/* Section Capital Social - test forcé */}
      <div className="w-full border-2 border-red-500 p-4 bg-yellow-100">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          TEST SECTION CAPITAL - Type: {client.type} - Condition: {isPersonneMorale ? 'TRUE' : 'FALSE'}
        </h2>
        {isPersonneMorale ? (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Capital Social et Actionnaires</h3>
            <CapitalSocialSection client={client} />
          </div>
        ) : (
          <p className="text-red-600">Client n'est pas une personne morale</p>
        )}
      </div>
      
      <InteractionsCard client={client} />
    </div>
  );
}
