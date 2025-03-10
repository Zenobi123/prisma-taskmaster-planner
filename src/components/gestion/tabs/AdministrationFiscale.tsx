
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, ClipboardList, UserRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AddDocumentDialog } from "./fiscale/AddDocumentDialog";
import { DocumentList } from "./fiscale/DocumentList";
import { ProceduresList } from "./fiscale/ProceduresList";
import { ContactsList } from "./fiscale/ContactsList";
import { SectionHeader } from "./fiscale/SectionHeader";
import { useFiscalDocuments } from "./fiscale/useFiscalDocuments";

export function AdministrationFiscale() {
  const { fiscalDocuments, handleAddDocument } = useFiscalDocuments();

  const handleItemClick = (item: any) => {
    console.log("Item clicked:", item);
    toast({
      title: "Document sélectionné",
      description: `Vous avez sélectionné: ${item.name}`,
    });
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
          <SectionHeader 
            icon={<FileSpreadsheet size={20} className="text-primary" />}
            title="Documents fiscaux"
          >
            <AddDocumentDialog onAddDocument={handleAddDocument} />
          </SectionHeader>
          <DocumentList 
            documents={fiscalDocuments} 
            onItemClick={handleItemClick} 
          />
        </div>
        
        {/* Section 2: Procédures courantes */}
        <div>
          <SectionHeader 
            icon={<ClipboardList size={20} className="text-primary" />}
            title="Procédures courantes"
          />
          <ProceduresList onItemClick={handleItemClick} />
        </div>
        
        {/* Section 3: Contacts principaux */}
        <div>
          <SectionHeader 
            icon={<UserRound size={20} className="text-primary" />}
            title="Contacts principaux"
          />
          <ContactsList onItemClick={handleItemClick} />
        </div>
      </CardContent>
    </Card>
  );
}
