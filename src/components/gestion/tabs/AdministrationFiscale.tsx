
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileSpreadsheet, ClipboardList, UserRound, Bell, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Mock document data with validity dates
const fiscalDocuments = [
  {
    id: "dsf",
    name: "Déclaration Statistique et Fiscale (DSF)",
    description: "Déclaration annuelle des résultats",
    validUntil: null, // No expiration for this document
  },
  {
    id: "dmt",
    name: "Déclaration Mensuelle des Taxes (DMT)",
    description: "Relevé mensuel des taxes collectées",
    validUntil: null, // No expiration for this document
  },
  {
    id: "acf",
    name: "Attestation de Conformité Fiscale (ACF)",
    description: "Certificat de situation fiscale",
    validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now (for testing notification)
  },
  {
    id: "ai",
    name: "Attestation d'Immatriculation (AI)",
    description: "Certificat d'immatriculation fiscale",
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now (3 months)
  }
];

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

export function AdministrationFiscale() {
  useEffect(() => {
    // Check for documents with less than 5 days validity
    fiscalDocuments.forEach(doc => {
      if (doc.validUntil) {
        const daysRemaining = Math.ceil((doc.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 5) {
          toast({
            title: "Document proche de l'expiration",
            description: `${doc.name} expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}.`,
            variant: "destructive",
          });
        }
      }
    });
  }, []);

  const handleItemClick = (item: any) => {
    console.log("Item clicked:", item);
    toast({
      title: "Document sélectionné",
      description: `Vous avez sélectionné: ${item.name}`,
    });
  };

  // Helper to render document validity
  const renderValidity = (validUntil: Date | null) => {
    if (!validUntil) return null;
    
    const daysRemaining = Math.ceil((validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const validityDate = validUntil.toLocaleDateString();
    
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
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-primary" />
            Documents fiscaux
          </h3>
          <div className="space-y-3">
            {fiscalDocuments.map((doc) => (
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
                  {renderValidity(doc.validUntil)}
                </div>
              </Button>
            ))}
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
