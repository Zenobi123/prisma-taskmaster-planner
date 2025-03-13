
import { toast } from "@/hooks/use-toast";
import { FiscalDocument, FiscalDocumentDisplay } from "@/components/gestion/tabs/fiscale/types";

/**
 * Maps a raw document from the database to the FiscalDocument type
 */
export const mapToFiscalDocument = (doc: any): FiscalDocument => ({
  id: doc.id,
  name: doc.name,
  description: doc.description || "",
  createdAt: new Date(doc.created_at),
  validUntil: doc.valid_until ? new Date(doc.valid_until) : null,
  client_id: doc.client_id
});

/**
 * Displays an error toast with appropriate message
 */
export const handleServiceError = (error: unknown, defaultMessage: string): void => {
  console.error(defaultMessage, error);
  toast({
    title: "Erreur",
    description: error instanceof Error ? error.message : defaultMessage,
    variant: "destructive",
  });
};
