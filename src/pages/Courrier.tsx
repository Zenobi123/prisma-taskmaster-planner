
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { TemplateSelection } from "@/components/courrier/TemplateSelection";
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection";
import { ClientsList } from "@/components/courrier/ClientsList";
import { PreviewDialog } from "@/components/courrier/PreviewDialog";
import { useCourrierData } from "@/hooks/useCourrierData";

export default function Courrier() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const {
    clients = [],
    collaborateurs = [],
    isLoading,
    error,
  } = useCourrierData();

  const filteredClients = clients.filter(client => {
    if (selectedCriteria.length === 0) return true;
    
    return selectedCriteria.some(criteria => {
      switch (criteria) {
        case "particuliers":
          return client.type === "physique";
        case "entreprises":
          return client.type === "morale";
        case "actifs":
          return client.statut === "actif";
        case "archives":
          return client.statut === "archive";
        default:
          return true;
      }
    });
  });

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            Erreur lors du chargement des données
          </div>
        </div>
      </PageLayout>
    );
  }

  const selectedClientsData = filteredClients.filter(client => 
    selectedClients.includes(client.id)
  );

  return (
    <PageLayout>
      <CourrierHeader />
      
      <div className="space-y-6">
        <TemplateSelection 
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
        
        <CriteriaSelection 
          selectedCriteria={selectedCriteria}
          onCriteriaChange={setSelectedCriteria}
        />
        
        <ClientsList 
          clients={filteredClients}
          selectedClients={selectedClients}
          onClientSelectionChange={setSelectedClients}
          onPreview={handlePreview}
        />
      </div>

      <PreviewDialog 
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        template={selectedTemplate}
        clients={selectedClientsData}
      />
    </PageLayout>
  );
}
