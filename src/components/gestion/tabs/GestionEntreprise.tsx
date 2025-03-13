
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiscalTabsNav } from "./fiscale/FiscalTabsNav";

interface GestionEntrepriseProps {
  onTabChange: (tab: string) => void;
}

export function GestionEntreprise({ onTabChange }: GestionEntrepriseProps) {
  const entrepriseOptions = [
    {
      id: "gestion-admin",
      title: "Administration",
      description: "Gestion des documents administratifs et processus"
    },
    {
      id: "gestion-rh",
      title: "Ressources Humaines",
      description: "Gestion des contrats et du personnel"
    },
    {
      id: "gestion-paie",
      title: "Paie",
      description: "Gestion des salaires et cotisations"
    },
    {
      id: "contrat-prestations",
      title: "Notre contrat de prestations",
      description: "Suivi et gestion de notre contrat"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion d'entreprise</CardTitle>
        <CardDescription>
          Gestion administrative, RH, contrats, paie et indicateurs de performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FiscalTabsNav options={entrepriseOptions} onTabChange={onTabChange} />
      </CardContent>
    </Card>
  );
}
