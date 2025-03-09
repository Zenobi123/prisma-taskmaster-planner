
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Link, FilePlus } from "lucide-react";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { GenerateACFDialog } from "./GenerateACFDialog";
import { FiscalDocument } from "./types";
import { toast } from "@/hooks/use-toast";
import { Client } from "@/types/client";

interface FiscalDocumentSectionProps {
  fiscalDocuments: FiscalDocument[];
  onAddDocument: (newDoc: Omit<FiscalDocument, "id">) => void;
  renderValidity: (doc: FiscalDocument) => React.ReactNode;
  selectedClient?: Client;
}

export const FiscalDocumentSection: React.FC<FiscalDocumentSectionProps> = ({
  fiscalDocuments,
  onAddDocument,
  renderValidity,
  selectedClient
}) => {
  const [isACFDialogOpen, setIsACFDialogOpen] = useState(false);
  
  const handleItemClick = (item: FiscalDocument) => {
    console.log("Document clicked:", item);
    toast({
      title: "Document sélectionné",
      description: `Vous avez sélectionné: ${item.name}`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-primary" />
          Documents fiscaux
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsACFDialogOpen(true)}
          >
            <FilePlus size={16} />
            Générer ACF
          </Button>
          <AddDocumentDialog onAddDocument={onAddDocument} />
        </div>
      </div>
      <div className="space-y-3">
        {fiscalDocuments.length > 0 ? (
          fiscalDocuments.map((doc) => (
            <Button 
              key={doc.id}
              variant="ghost" 
              className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
              onClick={() => handleItemClick(doc)}
            >
              <FileText size={20} className="text-primary mt-0.5" />
              <div className="text-left">
                <div className="font-medium flex items-center gap-1">
                  {doc.name}
                  <Link size={14} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
                {renderValidity(doc)}
                <div className="text-xs text-muted-foreground mt-1">
                  Créé le {doc.createdAt.toLocaleDateString()}
                </div>
              </div>
            </Button>
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            Aucun document fiscal. Utilisez le bouton "Ajouter un document" pour en créer.
          </div>
        )}
      </div>
      
      <GenerateACFDialog 
        open={isACFDialogOpen} 
        onOpenChange={setIsACFDialogOpen}
        selectedClient={selectedClient}
      />
    </div>
  );
};
