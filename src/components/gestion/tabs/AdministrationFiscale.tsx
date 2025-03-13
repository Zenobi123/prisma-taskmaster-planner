
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentSection } from "./fiscale/administration/DocumentSection";
import { useFiscalDocuments } from "./fiscale/useFiscalDocuments";

export function AdministrationFiscale() {
  const { fiscalDocuments, handleAddDocument } = useFiscalDocuments();

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
        />
      </CardContent>
    </Card>
  );
}
