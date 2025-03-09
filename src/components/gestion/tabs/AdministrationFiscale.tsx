
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiscalDocumentSection } from "./fiscale/FiscalDocumentSection";
import { ProceduresSection } from "./fiscale/ProceduresSection";
import { ContactsSection } from "./fiscale/ContactsSection";
import { useFiscalDocuments } from "./fiscale/hooks/useFiscalDocuments";
import { fiscalProcedures, fiscalContacts } from "./fiscale/data/mockData";

export function AdministrationFiscale() {
  const { filteredDocuments, handleAddDocument, renderValidity } = useFiscalDocuments();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Documents fiscaux */}
        <FiscalDocumentSection 
          fiscalDocuments={filteredDocuments}
          onAddDocument={handleAddDocument}
          renderValidity={renderValidity}
        />
        
        {/* Section 2: Procédures courantes */}
        <ProceduresSection procedures={fiscalProcedures} />
        
        {/* Section 3: Contacts principaux */}
        <ContactsSection contacts={fiscalContacts} />
      </CardContent>
    </Card>
  );
}
