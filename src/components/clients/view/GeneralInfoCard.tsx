import { Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegimeFiscal } from "@/types/client";

interface GeneralInfoCardProps {
  client: Client;
}

export function GeneralInfoCard({ client }: GeneralInfoCardProps) {
  const getRegimeFiscalLabel = (regime: RegimeFiscal) => {
    switch (regime) {
      case "reel": return "Réel";
      case "simplifie": return "Simplifié";
      case "liberatoire": return "Libératoire";
      case "non_professionnel_public": return "Non professionnel (Secteur public)";
      case "non_professionnel_prive": return "Non professionnel (Secteur privé)";
      case "non_professionnel_autre": return "Non professionnel (Autres)";
      default: return regime;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Informations générales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="outline" className="text-sm">
            {client.type === "physique" ? "Personne Physique" : "Personne Morale"}
          </Badge>
          <Badge variant={client.statut === "actif" ? "success" : "secondary"} className="text-sm">
            {client.statut === "actif" ? "Client Actif" : "Client Inactif"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {client.type === "physique" ? (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{client.nom}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium capitalize">{client.sexe}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">État civil</p>
                <p className="font-medium capitalize">{client.etatcivil}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Régime fiscal</p>
                <p className="font-medium">{client.regimefiscal && getRegimeFiscalLabel(client.regimefiscal)}</p>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Raison sociale</p>
              <p className="font-medium text-lg">{client.raisonsociale}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">NIU</p>
            <p className="font-medium">{client.niu}</p>
          </div>
          {client.numerocnps && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Numéro CNPS</p>
              <p className="font-medium">{client.numerocnps}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Centre de rattachement</p>
            <p className="font-medium">{client.centrerattachement}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Secteur d'activité</p>
            <p className="font-medium capitalize">{client.secteuractivite}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
