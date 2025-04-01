
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
  const moduleText = module === "parametres" 
    ? "aux paramètres du système" 
    : "à la gestion des collaborateurs";

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
