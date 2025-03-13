
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentSection } from "./fiscale/administration/DocumentSection";
import { useFiscalDocuments } from "./fiscale/useFiscalDocuments";
import { Client } from "@/types/client";

interface AdministrationFiscaleProps {
  selectedClient?: Client;
}

export function AdministrationFiscale({ selectedClient }: AdministrationFiscaleProps) {
  const { fiscalDocuments, loading, handleAddDocument } = useFiscalDocuments(selectedClient?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Gestion de l'Attestation de Conformité Fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section: Documents fiscaux */}
        <DocumentSection 
          documents={fiscalDocuments}
          onAddDocument={handleAddDocument}
          isLoading={loading}
          clientId={selectedClient?.id}
        />
      </CardContent>
    </Card>
  );
}
