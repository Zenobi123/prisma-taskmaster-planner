
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ObligationsFiscales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations fiscales</CardTitle>
        <CardDescription>Suivi et respect des échéances fiscales</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Contenu détaillé pour les obligations fiscales à venir...
        </p>
      </CardContent>
    </Card>
  );
}
