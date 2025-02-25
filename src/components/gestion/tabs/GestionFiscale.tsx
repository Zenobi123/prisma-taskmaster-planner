
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GestionFiscale() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion fiscale</CardTitle>
        <CardDescription>
          Suivi des obligations fiscales, optimisation fiscale, interface avec l'administration fiscale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Obligations fiscales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suivi et respect des échéances fiscales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimisation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Stratégies d'optimisation fiscale
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Administration fiscale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Relations avec l'administration fiscale
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
