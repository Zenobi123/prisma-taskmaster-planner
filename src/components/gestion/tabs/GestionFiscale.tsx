
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiscalTabsNav } from "./fiscale/FiscalTabsNav";

interface GestionFiscaleProps {
  onTabChange: (tab: string) => void;
}

export function GestionFiscale({ onTabChange }: GestionFiscaleProps) {
  const fiscalOptions = [
    {
      id: "obligations-fiscales",
      title: "Obligations fiscales",
      description: "Suivi et respect des échéances fiscales"
    },
    {
      id: "optimisation-fiscale",
      title: "Optimisation",
      description: "Stratégies d'optimisation fiscale"
    },
    {
      id: "administration-fiscale",
      title: "Administration fiscale",
      description: "Relations avec l'administration fiscale"
    },
    {
      id: "cloture-exercice",
      title: "Clôture d'exercice",
      description: "Préparation et traitement de la clôture fiscale annuelle"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion fiscale</CardTitle>
        <CardDescription>
          Suivi des obligations fiscales, optimisation fiscale, interface avec l'administration fiscale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FiscalTabsNav options={fiscalOptions} onTabChange={onTabChange} />
      </CardContent>
    </Card>
  );
}
