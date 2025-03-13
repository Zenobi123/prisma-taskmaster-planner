
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";

interface OptimisationFiscaleProps {
  client: Client;
}

export function OptimisationFiscale({ client }: OptimisationFiscaleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimisation fiscale</CardTitle>
        <CardDescription>Stratégies d'optimisation fiscale pour {client.type === "physique" ? client.nom : client.raisonsociale}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-8 text-center border rounded-md border-dashed">
          <p className="text-muted-foreground">Contenu en cours de développement</p>
        </div>
      </CardContent>
    </Card>
  );
}
