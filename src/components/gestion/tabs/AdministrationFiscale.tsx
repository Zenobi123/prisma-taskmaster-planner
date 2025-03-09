
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiscalContent } from "./fiscale/FiscalContent";
import { Client } from "@/types/client";

interface AdministrationFiscaleProps {
  selectedClient?: Client;
}

export function AdministrationFiscale({ selectedClient }: AdministrationFiscaleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent>
        <FiscalContent selectedClient={selectedClient} />
      </CardContent>
    </Card>
  );
}
