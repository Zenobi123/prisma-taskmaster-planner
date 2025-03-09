
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiscalContent } from "./fiscale/FiscalContent";

export function AdministrationFiscale() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent>
        <FiscalContent />
      </CardContent>
    </Card>
  );
}
