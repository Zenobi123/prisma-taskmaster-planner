
import { Client } from "@/types/client";
import { GeneralInfoCard } from "./view/GeneralInfoCard";
import { AddressCard } from "./view/AddressCard";
import { ContactCard } from "./view/ContactCard";
import { InteractionsCard } from "./view/InteractionsCard";
import { FiscalDashboard } from "./view/FiscalDashboard";
import { CapitalSocialSection } from "./capital/CapitalSocialSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, User, Building2 } from "lucide-react";
import { generateClientFichePDF } from "@/utils/pdf/clientFichePdfGenerator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  const isPersonneMorale = client.type === 'morale';

  const handlePrint = () => {
    generateClientFichePDF(client);
  };

  const clientName = isPersonneMorale
    ? client.raisonsociale || "Client sans nom"
    : client.nom || "Client sans nom";

  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "actif": return "success" as const;
      case "archive": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "actif": return "Actif";
      case "inactif": return "Inactif";
      case "archive": return "Archivé";
      default: return statut;
    }
  };

  return (
    <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-y-auto">
      <div className="space-y-6 p-1 pr-4 pb-4">
        {/* Header banner */}
        <div className="flex items-start justify-between bg-muted/40 rounded-lg p-4 border">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isPersonneMorale ? (
                <Building2 className="h-6 w-6" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{clientName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {isPersonneMorale ? "Personne Morale" : "Personne Physique"}
                </Badge>
                <Badge variant={getStatusBadgeVariant(client.statut)} className="text-xs">
                  {getStatusLabel(client.statut)}
                </Badge>
                {client.sigle && (
                  <Badge variant="outline" className="text-xs">{client.sigle}</Badge>
                )}
              </div>
            </div>
          </div>
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
            <h3 className="text-lg font-semibold mb-4 text-foreground">Capital Social et Actionnaires</h3>
            <CapitalSocialSection client={client} />
          </div>
        )}

        <FiscalDashboard client={client} />

        <InteractionsCard client={client} />

        {/* Footer with metadata */}
        {client.created_at && (
          <>
            <Separator />
            <p className="text-xs text-muted-foreground text-right">
              Fiche créée le {new Date(client.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
