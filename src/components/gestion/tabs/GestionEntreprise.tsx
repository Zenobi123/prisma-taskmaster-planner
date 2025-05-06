
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";
import { Building, Users, Receipt } from "lucide-react";

interface GestionEntrepriseProps {
  onTabChange: (tab: string) => void;
  selectedClient: Client;
}

export function GestionEntreprise({ onTabChange, selectedClient }: GestionEntrepriseProps) {
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
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-400" />
                Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestion des documents administratifs et processus
              </p>
            </CardContent>
          </Card>
          
          <Card onClick={() => onTabChange("gestion-rh")} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                Ressources Humaines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestion des contrats et du personnel
              </p>
            </CardContent>
          </Card>
          
          <Card onClick={() => onTabChange("gestion-paie")} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-gray-400" />
                Paie
              </CardTitle>
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
