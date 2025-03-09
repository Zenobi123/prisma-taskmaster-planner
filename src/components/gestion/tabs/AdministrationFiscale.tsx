
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileSpreadsheet, ClipboardList, UserRound, Bell, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AddDocumentDialog, FiscalDocument } from "./fiscale/AddDocumentDialog";

// Mock procedures
const fiscalProcedures = [
  {
    id: "demande-acf",
    name: "Demande d'attestation de conformité fiscale",
    description: "Procédure et documents requis",
  },
  {
    id: "reclamation",
    name: "Réclamation contentieuse",
    description: "Contestation d'un redressement fiscal",
  },
  {
    id: "redressement",
    name: "Procédure de redressement",
    description: "Étapes et recours disponibles",
  }
];

// Mock contacts
const fiscalContacts = [
  {
    id: "dgi",
    name: "Direction Générale des Impôts",
    description: "Yaoundé - Quartier Administratif",
    phone: "+237 222 23 11 11",
  },
  {
    id: "cime",
    name: "Centre des Impôts de Rattachement",
    description: "CIME Yaoundé I",
    phone: "+237 222 20 55 55",
  },
  {
    id: "control",
    name: "Service de Contrôle Fiscal",
    description: "Service des grandes entreprises",
    phone: "+237 222 20 40 40",
  }
];

// Initial fiscal documents
const initialFiscalDocuments: FiscalDocument[] = [
  {
    id: "dsf",
    name: "Déclaration Statistique et Fiscale (DSF)",
    description: "Déclaration annuelle des résultats",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    validUntil: null, // No expiration for this document
  },
  {
    id: "dmt",
    name: "Déclaration Mensuelle des Taxes (DMT)",
    description: "Relevé mensuel des taxes collectées",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    validUntil: null, // No expiration for this document
  },
  {
    id: "acf",
    name: "Attestation de Conformité Fiscale (ACF)",
    description: "Certificat de situation fiscale",
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 80 days ago
    validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now (for testing notification)
  },
  {
    id: "ai",
    name: "Attestation d'Immatriculation (AI)",
    description: "Certificat d'immatriculation fiscale",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now (3 months)
  }
];

export function AdministrationFiscale() {
  const [fiscalDocuments, setFiscalDocuments] = useState<FiscalDocument[]>(initialFiscalDocuments);

  // Filter out documents that expired more than 30 days ago
  const filteredDocuments = fiscalDocuments.filter(doc => {
    if (!doc.validUntil) return true; // Keep documents with no expiration
    
    const now = new Date();
    const expiredDays = (now.getTime() - doc.validUntil.getTime()) / (1000 * 60 * 60 * 24);
    return expiredDays <= 30; // Keep if expired less than 30 days ago or not expired yet
  });

  useEffect(() => {
    // Check for documents with less than 5 days validity
    filteredDocuments.forEach(doc => {
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
  }, [filteredDocuments]);

  const handleItemClick = (item: any) => {
    console.log("Item clicked:", item);
    toast({
      title: "Document sélectionné",
      description: `Vous avez sélectionné: ${item.name}`,
    });
  };

  // Add new document
  const handleAddDocument = (newDoc: Omit<FiscalDocument, "id">) => {
    const newDocument: FiscalDocument = {
      ...newDoc,
      id: Math.random().toString(36).substring(2, 9), // Generate simple ID
    };
    
    setFiscalDocuments(prev => [...prev, newDocument]);
  };

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
          <Bell size={14} className="mr-1" />
          Expiré depuis {Math.abs(daysRemaining)} jour{Math.abs(daysRemaining) > 1 ? 's' : ''} ({validityDate})
        </div>
      );
    }
    
    if (daysRemaining <= 5) {
      return (
        <div className="flex items-center mt-1 text-destructive text-xs">
          <Bell size={14} className="mr-1" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Documents fiscaux */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary" />
              Documents fiscaux
            </h3>
            <AddDocumentDialog onAddDocument={handleAddDocument} />
          </div>
          <div className="space-y-3">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
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
        </div>
        
        {/* Section 2: Procédures courantes */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <ClipboardList size={20} className="text-primary" />
            Procédures courantes
          </h3>
          <div className="space-y-3">
            {fiscalProcedures.map((proc) => (
              <Button 
                key={proc.id}
                variant="ghost" 
                className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
                onClick={() => handleItemClick(proc)}
              >
                <FileText size={20} className="text-primary mt-0.5" />
                <div className="text-left">
                  <div className="font-medium flex items-center gap-1">
                    {proc.name}
                    <Link size={14} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{proc.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Section 3: Contacts principaux */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <UserRound size={20} className="text-primary" />
            Contacts principaux
          </h3>
          <div className="space-y-3">
            {fiscalContacts.map((contact) => (
              <Button 
                key={contact.id}
                variant="ghost" 
                className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
                onClick={() => handleItemClick(contact)}
              >
                <FileText size={20} className="text-primary mt-0.5" />
                <div className="text-left">
                  <div className="font-medium flex items-center gap-1">
                    {contact.name}
                    <Link size={14} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
