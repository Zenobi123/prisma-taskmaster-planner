
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";
import { AddDocumentDialog } from "./fiscale/AddDocumentDialog";
import { DocumentList } from "./fiscale/DocumentList";
import { SectionHeader } from "./fiscale/SectionHeader";
import { useFiscalDocuments } from "./fiscale/useFiscalDocuments";
import { Client } from "@/types/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AdministrationFiscaleProps {
  client: Client;
}

export function AdministrationFiscale({ client }: AdministrationFiscaleProps) {
  const { fiscalDocuments, isLoading, handleAddDocument } = useFiscalDocuments(client.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section: Documents fiscaux */}
        <div>
          <SectionHeader 
            icon={<FileSpreadsheet size={20} className="text-primary" />}
            title="Documents fiscaux"
          >
            <AddDocumentDialog onAddDocument={handleAddDocument} />
          </SectionHeader>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <DocumentList 
              documents={fiscalDocuments} 
              onItemClick={() => {}} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
