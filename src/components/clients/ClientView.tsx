
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
    <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
      <div className="space-y-4 sm:space-y-6 p-1 pr-2 sm:pr-4 pb-4">
        {/* Header banner */}
        <div className="flex items-start justify-between gap-2 bg-muted/40 rounded-lg p-3 sm:p-4 border">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              {isPersonneMorale ? (
                <Building2 className="h-4 w-4 sm:h-6 sm:w-6" />
              ) : (
                <User className="h-4 w-4 sm:h-6 sm:w-6" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold truncate">{clientName}</h2>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  {isPersonneMorale ? "Morale" : "Physique"}
                </Badge>
                <Badge variant={getStatusBadgeVariant(client.statut)} className="text-[10px] sm:text-xs">
                  {getStatusLabel(client.statut)}
                </Badge>
                {client.sigle && (
                  <Badge variant="outline" className="text-[10px] sm:text-xs">{client.sigle}</Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1 sm:gap-2 shrink-0 h-8 px-2 sm:px-3">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimer la fiche</span>
          </Button>
        </div>

        <GeneralInfoCard client={client} />

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <AddressCard client={client} />
          <ContactCard client={client} />
        </div>

        {isPersonneMorale && (
          <div className="w-full">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Capital Social et Actionnaires</h3>
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
    </div>
  );
}
