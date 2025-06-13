
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { TemplateSelection } from "@/components/courrier/TemplateSelection";
import { ClientsList } from "@/components/courrier/ClientsList";
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection";
import { PreviewDialog } from "@/components/courrier/PreviewDialog";
import { useCourrierData } from "@/hooks/useCourrierData";

export default function Courrier() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState({
    type: "",
    regimeFiscal: "",
    secteurActivite: "",
    centreRattachement: "",
    statut: ""
  });
  const [showPreview, setShowPreview] = useState(false);

  const { templates, clients, filteredClients, isLoading } = useCourrierData();

  const handleCriteriaChange = (criteria: typeof selectedCriteria) => {
    setSelectedCriteria(criteria);
    // Reset selected clients when criteria change
    setSelectedClients([]);
  };

  const handleGeneratePreview = () => {
    if (!selectedTemplate) return;
    setShowPreview(true);
  };

  const canGeneratePreview = selectedTemplate && (selectedClients.length > 0 || Object.values(selectedCriteria).some(value => value !== ""));

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <CourrierHeader />
      
      <div className="space-y-6">
        <TemplateSelection
          templates={templates}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CriteriaSelection
              onCriteriaChange={handleCriteriaChange}
              selectedCriteria={selectedCriteria}
            />
            
            <div className="flex justify-center">
              <button
                onClick={handleGeneratePreview}
                disabled={!canGeneratePreview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Générer l'aperçu
              </button>
            </div>
          </div>
          
          <ClientsList
            clients={filteredClients}
            selectedClients={selectedClients}
            onClientsSelect={setSelectedClients}
          />
        </div>
      </div>

      <PreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        template={selectedTemplate}
        clients={selectedClients.length > 0 ? 
          clients.filter(c => selectedClients.includes(c.id)) : 
          filteredClients
        }
        criteria={selectedCriteria}
      />
    </PageLayout>
  );
}
