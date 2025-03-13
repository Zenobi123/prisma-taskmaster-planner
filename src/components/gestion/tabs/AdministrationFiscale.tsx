
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentSection } from "./fiscale/administration/DocumentSection";
import { useFiscalDocuments } from "./fiscale/useFiscalDocuments";
import { Client } from "@/types/client";

interface AdministrationFiscaleProps {
  client?: Client;
  selectedClient?: Client;
}

export function AdministrationFiscale({ client, selectedClient }: AdministrationFiscaleProps) {
  // Use client prop if provided, otherwise use selectedClient (for backward compatibility)
  const clientToUse = client || selectedClient;
  const { fiscalDocuments, handleAddDocument } = useFiscalDocuments(clientToUse?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section: Documents fiscaux */}
        <DocumentSection 
          documents={fiscalDocuments}
          onAddDocument={handleAddDocument}
          clientId={clientToUse?.id}
        />
      </CardContent>
    </Card>
  );
}
