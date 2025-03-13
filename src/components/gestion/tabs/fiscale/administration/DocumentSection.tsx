
import React from "react";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import { AddDocumentDialog } from "../AddDocumentDialog";
import { DocumentList } from "../DocumentList";
import { SectionHeader } from "../SectionHeader";
import { FiscalDocument } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentSectionProps {
  documents: FiscalDocument[];
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
  isLoading?: boolean;
  clientId?: string;
}

export function DocumentSection({ documents, onAddDocument, isLoading = false, clientId }: DocumentSectionProps) {
  // Filter for unique ACF documents
  const acfDocuments = React.useMemo(() => {
    // First, filter for documents of type ACF
    const acfDocs = documents.filter(doc => 
      doc.documentType === 'ACF' || 
      (doc.name && doc.name.includes("Attestation de Conformité Fiscale"))
    );
    
    // If multiple documents exist, keep only the most recent one
    if (acfDocs.length > 1) {
      // Sort by creation date descending (newest first)
      return [acfDocs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]];
    }
    
    return acfDocs;
  }, [documents]);
  
  // Check if ACF document already exists
  const hasAcfDocument = acfDocuments.length > 0;
  
  // Function to delete all test ACF documents
  const deleteTestACFDocuments = async () => {
    if (!clientId) {
      toast({
        title: "Erreur",
        description: "Aucun client sélectionné",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("fiscal_documents")
        .delete()
        .eq("document_type", "ACF")
        .eq("name", "Attestation de Conformité Fiscale");
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Les attestations de test ont été supprimées",
      });
      
      // Refresh the page to update the list
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la suppression des documents:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les attestations de test",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <SectionHeader 
        icon={<FileSpreadsheet size={20} className="text-primary" />}
        title="Attestation de Conformité Fiscale"
      >
        <div className="flex gap-2">
          {clientId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deleteTestACFDocuments}
              className="flex items-center gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 size={14} />
              Supprimer documents test
            </Button>
          )}
          
          {clientId && !hasAcfDocument ? (
            <AddDocumentDialog onAddDocument={(doc) => {
              // Force document type to be ACF when adding a new document
              onAddDocument({
                ...doc,
                documentType: 'ACF',
                name: 'Attestation de Conformité Fiscale'
              });
            }} />
          ) : clientId && hasAcfDocument ? (
            <div className="text-sm text-muted-foreground">
              Une attestation existe déjà
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Sélectionnez un client pour ajouter une attestation
            </div>
          )}
        </div>
      </SectionHeader>
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : clientId ? (
        <>
          <DocumentList 
            documents={acfDocuments}
            onItemClick={() => {}} 
          />
          {acfDocuments.length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              Aucune Attestation de Conformité Fiscale. Utilisez le bouton "Ajouter un document" pour en créer.
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-4 text-muted-foreground">
          Veuillez sélectionner un client pour voir son Attestation de Conformité Fiscale.
        </div>
      )}
    </div>
  );
}
