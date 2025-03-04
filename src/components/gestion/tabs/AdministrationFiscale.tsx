
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdministrationFiscale() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Contenu détaillé pour les relations avec l'administration fiscale à venir...
        </p>
      </CardContent>
    </Card>
  );
}
