
import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { AddDocumentDialog } from "../AddDocumentDialog";
import { DocumentList } from "../DocumentList";
import { SectionHeader } from "../SectionHeader";
import { FiscalDocument } from "../types";

interface DocumentSectionProps {
  documents: FiscalDocument[];
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
  clientId?: string;
}

export function DocumentSection({ documents, onAddDocument, clientId }: DocumentSectionProps) {
  return (
    <div>
      <SectionHeader 
        icon={<FileSpreadsheet size={20} className="text-primary" />}
        title="Documents fiscaux"
      >
        <AddDocumentDialog onAddDocument={onAddDocument} clientId={clientId} />
      </SectionHeader>
      <DocumentList 
        documents={documents} 
        onItemClick={() => {}} 
      />
    </div>
  );
}
