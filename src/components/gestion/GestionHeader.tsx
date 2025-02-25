
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface GestionHeaderProps {
  nombreClientsEnGestion: number;
}

export function GestionHeader({ nombreClientsEnGestion }: GestionHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">
            Gestion des dossiers clients
          </h1>
          <p className="text-neutral-600 mt-1">
            Gestion complète des dossiers clients en externalisation
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {nombreClientsEnGestion}
            </CardTitle>
            <CardDescription>Clients en gestion</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
