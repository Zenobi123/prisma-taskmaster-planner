
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "../types";

export function useDocumentNotifications(documents: FiscalDocument[]) {
  useEffect(() => {
    // Check for documents with less than 5 days validity
    documents.forEach(doc => {
      if (doc.validUntil) {
        const daysRemaining = Math.ceil((doc.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 5 && daysRemaining > 0) {
          toast({
            title: "Document proche de l'expiration",
            description: `${doc.name} expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}.`,
            variant: "destructive",
          });
        }
      }
    });
  }, [documents]);
}
