
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
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-[#F2FCE2]"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1F2C] mb-2">
            Gestion des dossiers clients
          </h1>
          <p className="text-[#8E9196] text-lg">
            Gestion complète des dossiers clients en externalisation
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#84A98C] to-[#6B8E74] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold">
              {nombreClientsEnGestion}
            </CardTitle>
            <CardDescription className="text-white/90">
              Clients en gestion
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
