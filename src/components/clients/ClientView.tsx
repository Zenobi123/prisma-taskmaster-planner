
import { Client } from "@/types/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneralInfoCard } from "./view/GeneralInfoCard";
import { AddressCard } from "./view/AddressCard";
import { ContactCard } from "./view/ContactCard";
import { InteractionsCard } from "./view/InteractionsCard";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  return (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-6">
        <GeneralInfoCard client={client} />
        <AddressCard client={client} />
        <ContactCard client={client} />
        <InteractionsCard client={client} />
      </div>
    </ScrollArea>
  );
}
