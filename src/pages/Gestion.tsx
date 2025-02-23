
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Gestion() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Gestion des dossiers
            </h1>
            <p className="text-neutral-600 mt-1">
              Gestion complète des dossiers clients en externalisation
            </p>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        {/* Contenu à venir */}
        <p className="text-neutral-600">
          Cette section permettra la gestion complète des dossiers des clients ayant externalisé leurs opérations auprès de notre cabinet.
        </p>
      </div>
    </div>
  );
}
