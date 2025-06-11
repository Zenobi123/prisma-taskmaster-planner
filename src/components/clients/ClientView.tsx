
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
  console.log("ClientView - Type de client:", client.type);
  console.log("ClientView - Client complet:", client);

  return (
    <div className="space-y-6">
      <GeneralInfoCard client={client} />
      <div className="grid md:grid-cols-2 gap-6">
        <AddressCard client={client} />
        <ContactCard client={client} />
      </div>
      
      {/* Section Capital Social - uniquement pour les personnes morales */}
      {client.type === 'morale' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Capital Social et Actionnaires</h3>
          <CapitalSocialSection client={client} />
        </div>
      )}
      
      <InteractionsCard client={client} />
    </div>
  );
}
