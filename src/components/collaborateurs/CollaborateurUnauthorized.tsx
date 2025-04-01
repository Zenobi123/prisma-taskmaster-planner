
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";

export const CollaborateurUnauthorized = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <PageLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Seuls les administrateurs peuvent accéder à la gestion des collaborateurs.
          </AlertDescription>
        </Alert>
      </PageLayout>
    </div>
  );
};
