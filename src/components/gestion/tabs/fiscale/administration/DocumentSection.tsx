
import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { AddDocumentDialog } from "../AddDocumentDialog";
import { DocumentList } from "../DocumentList";
import { SectionHeader } from "../SectionHeader";
import { FiscalDocument } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentSectionProps {
  documents: FiscalDocument[];
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
  isLoading?: boolean;
  clientId?: string;
}

export function DocumentSection({ documents, onAddDocument, isLoading = false, clientId }: DocumentSectionProps) {
  return (
    <div>
      <SectionHeader 
        icon={<FileSpreadsheet size={20} className="text-primary" />}
        title="Documents fiscaux"
      >
        {clientId ? (
          <AddDocumentDialog onAddDocument={onAddDocument} />
        ) : (
          <div className="text-sm text-muted-foreground">
            Sélectionnez un client pour ajouter des documents
          </div>
        )}
      </SectionHeader>
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : clientId ? (
        <DocumentList 
          documents={documents} 
          onItemClick={() => {}} 
        />
      ) : (
        <div className="text-center p-4 text-muted-foreground">
          Veuillez sélectionner un client pour voir ses documents fiscaux.
        </div>
      )}
    </div>
  );
}
