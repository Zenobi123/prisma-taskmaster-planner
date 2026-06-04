
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import { AuthorizedModule } from "@/hooks/useAuthorization";

interface CollaborateurUnauthorizedProps {
  module?: AuthorizedModule;
}

export const CollaborateurUnauthorized = ({ 
  module = "collaborateurs" 
}: CollaborateurUnauthorizedProps) => {
  const moduleTexts: Record<AuthorizedModule, string> = {
    collaborateurs: "à la gestion des collaborateurs",
    parametres: "aux paramètres du système",
    facturation: "à la gestion de la facturation",
    clients: "à la gestion des clients",
    gestion: "à la gestion des dossiers clients",
    missions: "à la gestion des missions",
    planning: "au planning",
    courrier: "à la gestion du courrier",
    rapports: "aux rapports",
    dashboard: "au tableau de bord",
    aide: "à l'aide",
  };
  const moduleText = moduleTexts[module] || "à ce module";

  return (
    <div className="flex h-screen">
      <Sidebar />
      <PageLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Seuls les administrateurs peuvent accéder {moduleText}.
          </AlertDescription>
        </Alert>
      </PageLayout>
    </div>
  );
};
