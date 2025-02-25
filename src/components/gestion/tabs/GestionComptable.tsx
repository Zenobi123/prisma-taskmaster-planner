
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GestionComptable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion comptable</CardTitle>
        <CardDescription>
          Saisie et validation des écritures, automatisation des opérations comptables, génération de rapports financiers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Écritures comptables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Saisie et validation des écritures
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automatisation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatisation des opérations comptables
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Génération des rapports financiers
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
