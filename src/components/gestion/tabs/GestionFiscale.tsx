
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GestionFiscaleProps {
  onTabChange: (tab: string) => void;
}

export function GestionFiscale({ onTabChange }: GestionFiscaleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion fiscale</CardTitle>
        <CardDescription>
          Suivi des obligations fiscales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card onClick={() => onTabChange("obligations-fiscales")} className="cursor-pointer hover-lift hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Obligations fiscales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suivi et respect des échéances fiscales
              </p>
            </CardContent>
          </Card>
          <Card onClick={() => onTabChange("cloture-exercice")} className="cursor-pointer hover-lift animate-fade-in hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Clôture d'exercice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Préparation et traitement de la clôture fiscale annuelle
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
