
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GestionEntrepriseProps {
  onTabChange: (tab: string) => void;
}

export function GestionEntreprise({ onTabChange }: GestionEntrepriseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion d'entreprise</CardTitle>
        <CardDescription>
          Gestion administrative, RH, contrats, paie et indicateurs de performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card onClick={() => onTabChange("gestion-admin")} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestion des documents administratifs et processus
              </p>
            </CardContent>
          </Card>
          <Card onClick={() => onTabChange("gestion-rh")} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Ressources Humaines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestion des contrats et du personnel
              </p>
            </CardContent>
          </Card>
          <Card onClick={() => onTabChange("gestion-paie")} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Paie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestion des salaires et cotisations
              </p>
            </CardContent>
          </Card>
          <Card onClick={() => onTabChange("contrat-prestations")} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Notre contrat de prestations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suivi et gestion de notre contrat
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
