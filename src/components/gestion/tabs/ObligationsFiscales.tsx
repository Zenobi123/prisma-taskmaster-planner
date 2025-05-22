
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Client } from "@/types/client";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales: React.FC<ObligationsFiscalesProps> = ({ selectedClient }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Obligations Fiscales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium text-center">En cours développement</h3>
          <p className="text-gray-500 mt-2 text-center max-w-lg">
            Ce module est actuellement en cours de développement et sera disponible prochainement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObligationsFiscales;
