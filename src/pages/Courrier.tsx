
    import React, { useState } from "react";
    import PageLayout from "@/components/layout/PageLayout";
    import { CourrierHeader } from "@/components/courrier/CourrierHeader";
    import { ClientsList, ClientsListProps } from "@/components/courrier/ClientsList"; // Assuming ClientsListProps is exported
    import { CriteriaSelection, CriteriaSelectionProps } from "@/components/courrier/CriteriaSelection"; // Assuming CriteriaSelectionProps is exported
    import { TemplateSelection, TemplateSelectionProps } from "@/components/courrier/TemplateSelection"; // Assuming TemplateSelectionProps is exported
    import { PreviewDialog, PreviewDialogProps } from "@/components/courrier/PreviewDialog"; // Assuming PreviewDialogProps is exported
    import { useCourrierData } from "@/hooks/useCourrierData";
    import { Client } from "@/types/client";
    
    export default function Courrier() {
      const { clients, collaborateurs, isLoading, error } = useCourrierData();
      const [selectedClients, setSelectedClients] = useState<string[]>([]);
      const [selectedCriteria, setSelectedCriteria] = useState<CriteriaSelectionProps['selectedCriteria']>({
        type: "",
        regimeFiscal: "",
        secteurActivite: "",
        centreRattachement: "",
        statut: ""
      });
      const [generationType, setGenerationType] = useState<CriteriaSelectionProps['generationType']>("individuel"); // Added state for generationType
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
    
      const filteredClients = clients; // Assuming clients are already filtered if needed or filtering logic is elsewhere
    
      // Props for ClientsList
      const clientsListProps: ClientsListProps = {
        clients: filteredClients,
        selectedClientIds: selectedClients, // Assuming ClientsList expects selectedClientIds
        onSelectionChange: setSelectedClients,
      };
    
      // Props for CriteriaSelection
      const criteriaSelectionProps: CriteriaSelectionProps = {
        selectedCriteria,
        onCriteriaChange: setSelectedCriteria,
        generationType,
        onGenerationTypeChange: setGenerationType,
      };
    
      // Props for TemplateSelection
      const templateSelectionProps: TemplateSelectionProps = {
        selectedTemplateId: selectedTemplate, // Assuming prop name is selectedTemplateId
        onTemplateChange: setSelectedTemplate,
        // disabled prop might be handled internally or named differently
      };
    
       // Props for PreviewDialog
      const previewDialogProps: PreviewDialogProps = {
        open: showPreview,
        onOpenChange: setShowPreview,
        clients: selectedClients.map(id => 
          clients.find(c => c.id === id)!
        ).filter(Boolean) as Client[], // Ensure it's Client[]
        templateId: selectedTemplate, // Assuming prop name is templateId
        generationType: generationType,
      };
    
      return (
        <PageLayout>
          <div className="space-y-8">
            <CourrierHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sélection des clients */}
              <ClientsList {...clientsListProps} />
    
              {/* Sélection des critères */}
              <CriteriaSelection {...criteriaSelectionProps} />
    
              {/* Sélection du modèle */}
              <TemplateSelection 
                {...templateSelectionProps} 
                // Example of how disabled might be handled if it's a direct prop
                // disabled={selectedClients.length === 0 || !selectedTemplate} 
              />
            </div>
    
            {/* Dialog de prévisualisation */}
            <PreviewDialog {...previewDialogProps} />
          </div>
        </PageLayout>
      );
    }
    
    