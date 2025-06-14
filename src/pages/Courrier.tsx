
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { ClientsList } from "@/components/courrier/ClientsList"; // Assuming ClientsListProps is inline or inferred
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection"; // Assuming CriteriaSelectionProps is inline or inferred
import { TemplateSelection } from "@/components/courrier/TemplateSelection"; // Assuming TemplateSelectionProps is inline or inferred
import { PreviewDialog } from "@/components/courrier/PreviewDialog"; // Assuming PreviewDialogProps is inline or inferred
import { useCourrierData } from "@/hooks/useCourrierData";
import { Client } from "@/types/client";

// Define Props types here if they are not directly exported by components
// For simplicity, if props are simple, they might be inferred by TS.
// If complex, they should be exported from their component files.
// For now, removing explicit prop type imports as they cause errors.

interface ClientsListPropsForPage {
  clients: Client[];
  selectedClientIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

interface CriteriaSelectionPropsForPage {
  selectedCriteria: {
    type: string;
    regimeFiscal: string;
    secteurActivite: string;
    centreRattachement: string;
    statut: string;
  };
  onCriteriaChange: (criteria: CriteriaSelectionPropsForPage['selectedCriteria']) => void;
  generationType: "individuel" | "masse";
  onGenerationTypeChange: (type: "individuel" | "masse") => void;
}

interface TemplateSelectionPropsForPage {
  selectedTemplateId: string | null;
  onTemplateChange: (id: string | null) => void;
  // disabled?: boolean; // Example if needed
}

interface PreviewDialogPropsForPage {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  templateId: string | null;
  generationType: "individuel" | "masse";
}


export default function Courrier() {
  const { clients, collaborateurs, isLoading, error } = useCourrierData();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaSelectionPropsForPage['selectedCriteria']>({
    type: "",
    regimeFiscal: "",
    secteurActivite: "",
    centreRattachement: "",
    statut: ""
  });
  const [generationType, setGenerationType] = useState<CriteriaSelectionPropsForPage['generationType']>("individuel");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-red-500">Erreur lors du chargement des données</p>
        </div>
      </PageLayout>
    );
  }

  const filteredClients = clients; 

  const clientsListProps: ClientsListPropsForPage = {
    clients: filteredClients,
    selectedClientIds: selectedClients,
    onSelectionChange: setSelectedClients,
  };

  const criteriaSelectionProps: CriteriaSelectionPropsForPage = {
    selectedCriteria,
    onCriteriaChange: setSelectedCriteria,
    generationType,
    onGenerationTypeChange: setGenerationType,
  };

  const templateSelectionProps: TemplateSelectionPropsForPage = {
    selectedTemplateId: selectedTemplate,
    onTemplateChange: setSelectedTemplate,
  };

  const previewDialogProps: PreviewDialogPropsForPage = {
    open: showPreview,
    onOpenChange: setShowPreview,
    clients: selectedClients.map(id => 
      clients.find(c => c.id === id)!
    ).filter(Boolean) as Client[],
    templateId: selectedTemplate,
    generationType: generationType,
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <CourrierHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ClientsList {...clientsListProps} />
          <CriteriaSelection {...criteriaSelectionProps} />
          <TemplateSelection {...templateSelectionProps} />
        </div>

        <PreviewDialog {...previewDialogProps} />
      </div>
    </PageLayout>
  );
}
