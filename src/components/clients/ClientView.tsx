
import { Client } from "@/types/client";
import { GeneralInfoCard } from "./view/GeneralInfoCard";
import { AddressCard } from "./view/AddressCard";
import { ContactCard } from "./view/ContactCard";
import { InteractionsCard } from "./view/InteractionsCard";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  return (
    <div className="space-y-6">
      <GeneralInfoCard client={client} />
      <div className="grid md:grid-cols-2 gap-6">
        <AddressCard client={client} />
        <ContactCard client={client} />
      </div>
      <InteractionsCard client={client} />
    </div>
  );
}
