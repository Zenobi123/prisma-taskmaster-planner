
import { Client } from "@/types/client";
import { GeneralInfoCard } from "./view/GeneralInfoCard";
import { AddressCard } from "./view/AddressCard";
import { ContactCard } from "./view/ContactCard";
import { InteractionsCard } from "./view/InteractionsCard";
import { CapitalSocialSection } from "./capital/CapitalSocialSection";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { generateClientFichePDF } from "@/utils/pdf/clientFichePdfGenerator";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  const isPersonneMorale = client.type === 'morale';

  const handlePrint = () => {
    generateClientFichePDF(client);
  };

  return (
    <div className="h-full max-h-[80vh] overflow-y-auto space-y-6 p-1">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimer la fiche
        </Button>
      </div>
      <GeneralInfoCard client={client} />
      <div className="grid md:grid-cols-2 gap-6">
        <AddressCard client={client} />
        <ContactCard client={client} />
      </div>
      
      {isPersonneMorale && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Capital Social et Actionnaires</h3>
          <CapitalSocialSection client={client} />
        </div>
      )}
      
      <InteractionsCard client={client} />
    </div>
  );
}
