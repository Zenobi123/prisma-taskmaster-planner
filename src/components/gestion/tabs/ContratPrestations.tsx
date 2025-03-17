
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";

interface ContratPrestationsProps {
  client: Client;
}

export function ContratPrestations({ client }: ContratPrestationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrat de prestations</CardTitle>
        <CardDescription>
          Détails du contrat et suivi des prestations pour {client.nom || client.raisonsociale}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conditions contractuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Détails des termes du contrat
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suivi des prestations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Historique des prestations fournies
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Échéances</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dates clés et renouvellements
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
