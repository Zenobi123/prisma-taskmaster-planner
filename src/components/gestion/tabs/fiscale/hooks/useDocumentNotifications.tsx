import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "../types";

export function useDocumentNotifications(documents: FiscalDocument[]) {
  const [hasShownNotifications, setHasShownNotifications] = useState(false);

  useEffect(() => {
    if (!documents.length || hasShownNotifications) return;
    
    // Keep track of notifications shown to avoid duplicates on re-render
    const expiringDocuments: {id: string, name: string, days: number}[] = [];
    
    // Check for documents with less than 5 days validity
    documents.forEach(doc => {
      if (doc.validUntil) {
        const daysRemaining = Math.ceil((doc.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 5 && daysRemaining > 0) {
          expiringDocuments.push({
            id: doc.id,
            name: doc.name,
            days: daysRemaining
          });
        }
      }
    });
    
    // Show notifications for expiring documents
    if (expiringDocuments.length > 0) {
      expiringDocuments.forEach(doc => {
        toast({
          title: "Document proche de l'expiration",
          description: `${doc.name} expire dans ${doc.days} jour${doc.days > 1 ? 's' : ''}.`,
          variant: "destructive",
        });
      });
      
      setHasShownNotifications(true);
    }
  }, [documents, hasShownNotifications]);
}
