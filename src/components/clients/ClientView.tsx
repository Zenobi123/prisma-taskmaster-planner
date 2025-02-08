
import { Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  return (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Informations générales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline" className="mt-1">
                {client.type === "physique" ? "Personne Physique" : "Personne Morale"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge variant={client.statut === "actif" ? "success" : "secondary"} className="mt-1">
                {client.statut}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {client.type === "physique" ? "Nom" : "Raison sociale"}
              </p>
              <p className="font-medium">
                {client.type === "physique" ? client.nom : client.raisonsociale}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NIU</p>
              <p className="font-medium">{client.niu}</p>
            </div>
            {client.numerocnps && (
              <div>
                <p className="text-sm text-muted-foreground">Numéro CNPS</p>
                <p className="font-medium">{client.numerocnps}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Centre de rattachement</p>
              <p className="font-medium">{client.centrerattachement}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Secteur d'activité</p>
              <p className="font-medium">{client.secteuractivite}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Adresse</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ville</p>
              <p className="font-medium">{client.adresse.ville}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quartier</p>
              <p className="font-medium">{client.adresse.quartier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lieu-dit</p>
              <p className="font-medium">{client.adresse.lieuDit}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{client.contact.telephone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{client.contact.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Historique des interactions</h3>
          {client.interactions && client.interactions.length > 0 ? (
            <div className="space-y-4">
              {client.interactions.map((interaction, index) => (
                <div key={interaction.id} className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    {new Date(interaction.date).toLocaleDateString()}
                  </p>
                  <p className="mt-1">{interaction.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune interaction enregistrée</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
