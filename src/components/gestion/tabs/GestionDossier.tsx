
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";

interface GestionDossierProps {
  selectedClient: Client;
}

export function GestionDossier({ selectedClient }: GestionDossierProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion documentaire</CardTitle>
        <CardDescription>
          Mise à jour, gestion documentaire et suivi des interactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestion et archivage des documents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suivi des interactions avec le client
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mises à jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Historique des mises à jour du dossier
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
