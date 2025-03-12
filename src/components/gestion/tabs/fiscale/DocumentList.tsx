
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Link as LinkIcon } from "lucide-react";
import { FiscalDocument } from "./types";

interface DocumentListProps {
  documents: FiscalDocument[];
  onItemClick: (item: any) => void;
}

export function DocumentList({ documents, onItemClick }: DocumentListProps) {
  // Helper to render document validity
  const renderValidity = (doc: FiscalDocument) => {
    if (!doc.validUntil) return null;
    
    const now = new Date();
    const validUntil = new Date(doc.validUntil);
    const daysRemaining = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const validityDate = validUntil.toLocaleDateString();
    
    if (daysRemaining <= 0) {
      return (
        <div className="flex items-center mt-1 text-destructive text-xs">
          Expiré depuis {Math.abs(daysRemaining)} jour{Math.abs(daysRemaining) > 1 ? 's' : ''} ({validityDate})
        </div>
      );
    }
    
    if (daysRemaining <= 30) {
      return (
        <div className="flex items-center mt-1 text-amber-600 text-xs">
          Expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} ({validityDate})
        </div>
      );
    }
    
    return (
      <div className="text-xs text-muted-foreground mt-1">
        Valide jusqu'au {validityDate}
      </div>
    );
  };

  if (documents.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Aucun document fiscal. Utilisez le bouton "Ajouter un document" pour en créer.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Button 
          key={doc.id}
          variant="ghost" 
          className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
          onClick={() => onItemClick(doc)}
        >
          <FileText size={20} className="text-primary mt-0.5" />
          <div className="text-left">
            <div className="font-medium flex items-center gap-1">
              {doc.name}
              <LinkIcon size={14} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{doc.description}</p>
            {renderValidity(doc)}
            <div className="text-xs text-muted-foreground mt-1">
              Créé le {doc.createdAt.toLocaleDateString()}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}
