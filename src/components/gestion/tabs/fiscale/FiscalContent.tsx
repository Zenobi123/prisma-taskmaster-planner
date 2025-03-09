
import React from "react";
import { FiscalDocumentSection } from "./FiscalDocumentSection";
import { ProceduresSection } from "./ProceduresSection";
import { ContactsSection } from "./ContactsSection";
import { useFiscalDocuments } from "./hooks/useFiscalDocuments";
import { fiscalProcedures, fiscalContacts } from "./data/mockData";
import { Client } from "@/types/client";

interface FiscalContentProps {
  selectedClient?: Client;
}

export function FiscalContent({ selectedClient }: FiscalContentProps) {
  const { filteredDocuments, handleAddDocument, renderValidity, isLoading } = useFiscalDocuments(selectedClient);

  return (
    <div className="space-y-6">
      {/* Section 1: Documents fiscaux */}
      <FiscalDocumentSection 
        fiscalDocuments={filteredDocuments}
        onAddDocument={handleAddDocument}
        renderValidity={renderValidity}
        selectedClient={selectedClient}
        isLoading={isLoading}
      />
      
      {/* Section 2: Procédures courantes */}
      <ProceduresSection procedures={fiscalProcedures} />
      
      {/* Section 3: Contacts principaux */}
      <ContactsSection contacts={fiscalContacts} />
    </div>
  );
}
