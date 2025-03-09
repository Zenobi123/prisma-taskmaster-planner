
import React from "react";
import { FiscalDocumentSection } from "./FiscalDocumentSection";
import { ProceduresSection } from "./ProceduresSection";
import { ContactsSection } from "./ContactsSection";
import { useFiscalDocuments } from "./hooks/useFiscalDocuments";
import { fiscalProcedures, fiscalContacts } from "./data/mockData";

export function FiscalContent() {
  const { filteredDocuments, handleAddDocument, renderValidity } = useFiscalDocuments();

  return (
    <div className="space-y-6">
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
    </div>
  );
}
