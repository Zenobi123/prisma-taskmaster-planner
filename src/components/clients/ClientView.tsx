
import { Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PhoneIcon, MailIcon, BuildingIcon, MapPinIcon } from "lucide-react";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  return (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-6">
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
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium text-lg">{client.nom}</p>
                </div>
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

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold">Adresse</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ville</p>
                <p className="font-medium">{client.adresse?.ville}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Quartier</p>
                <p className="font-medium">{client.adresse?.quartier}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lieu-dit</p>
                <p className="font-medium">{client.adresse?.lieuDit || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold">Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{client.contact?.telephone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.contact?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold">Historique des interactions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {client.interactions && client.interactions.length > 0 ? (
              <div className="space-y-4">
                {client.interactions.map((interaction, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(interaction.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm">{interaction.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucune interaction enregistrée</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
