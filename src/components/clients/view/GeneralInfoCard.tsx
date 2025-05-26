
import { Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormeJuridique } from "@/types/client";

interface GeneralInfoCardProps {
  client: Client;
}

export function GeneralInfoCard({ client }: GeneralInfoCardProps) {
  const getFormeJuridiqueLabel = (forme: FormeJuridique) => {
    switch (forme) {
      case "sa": return "Société Anonyme (SA)";
      case "sarl": return "Société à Responsabilité Limitée (SARL)";
      case "sas": return "Société par Actions Simplifiée (SAS)";
      case "snc": return "Société en Nom Collectif (SNC)";
      case "association": return "Association";
      case "gie": return "Groupement d'Intérêt Économique (GIE)";
      case "autre": return "Autre";
      default: return forme;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(montant) + ' FCFA';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (statut: string) => {
    switch(statut) {
      case "actif": return "success";
      case "archive": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch(statut) {
      case "actif": return "Client Actif";
      case "inactif": return "Client Inactif";
      case "archive": return "Client Archivé";
      default: return statut;
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
          <Badge variant={getStatusBadgeVariant(client.statut)} className="text-sm">
            {getStatusLabel(client.statut)}
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
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Raison sociale</p>
                <p className="font-medium text-lg">{client.raisonsociale}</p>
              </div>
              {client.sigle && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sigle</p>
                  <p className="font-medium">{client.sigle}</p>
                </div>
              )}
              {client.datecreation && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date de création</p>
                  <p className="font-medium">{formatDate(client.datecreation)}</p>
                </div>
              )}
              {client.lieucreation && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lieu de création</p>
                  <p className="font-medium">{client.lieucreation}</p>
                </div>
              )}
              {client.nomdirigeant && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dirigeant</p>
                  <p className="font-medium">{client.nomdirigeant}</p>
                </div>
              )}
              {client.formejuridique && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Forme juridique</p>
                  <p className="font-medium">{getFormeJuridiqueLabel(client.formejuridique)}</p>
                </div>
              )}
            </>
          )}
          
          {client.situationimmobiliere && (
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">Situation immobilière</p>
              <p className="font-medium">
                {client.situationimmobiliere.type === "proprietaire" ? (
                  <>
                    Propriétaire 
                    {client.situationimmobiliere.valeur && 
                      ` - Valeur : ${formatMontant(client.situationimmobiliere.valeur)}`
                    }
                  </>
                ) : (
                  <>
                    Locataire
                    {client.situationimmobiliere.loyer && 
                      ` - Loyer mensuel : ${formatMontant(client.situationimmobiliere.loyer)}`
                    }
                  </>
                )}
              </p>
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
