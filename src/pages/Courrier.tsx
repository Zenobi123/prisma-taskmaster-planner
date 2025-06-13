
import { useState } from "react";
import CourrierHeader from "@/components/courrier/CourrierHeader";
import TemplateSelection from "@/components/courrier/TemplateSelection";
import CriteriaSelection from "@/components/courrier/CriteriaSelection";
import ClientsList from "@/components/courrier/ClientsList";
import PreviewDialog from "@/components/courrier/PreviewDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface FilterCriteria {
  type: string;
  regimeFiscal: string;
  secteurActivite: string;
  centreRattachement: string;
  statut: string;
}

export default function Courrier() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    type: "",
    regimeFiscal: "",
    secteurActivite: "",
    centreRattachement: "",
    statut: ""
  });
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleCriteriaChange = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  const handleClientSelect = (clientIds: string[]) => {
    setSelectedClients(clientIds);
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleGenerate = () => {
    console.log("Generating documents for:", {
      template: selectedTemplate,
      criteria: filterCriteria,
      clients: selectedClients
    });
  };

  return (
    <div className="p-8 space-y-8">
      <CourrierHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
          
          <CriteriaSelection
            criteria={filterCriteria}
            onCriteriaChange={handleCriteriaChange}
          />
        </div>
        
        <div className="space-y-6">
          <ClientsList
            criteria={filterCriteria}
            selectedClients={selectedClients}
            onClientSelect={handleClientSelect}
          />
          
          <div className="flex gap-4">
            <Button 
              onClick={handlePreview}
              disabled={!selectedTemplate || selectedClients.length === 0}
              variant="outline"
              className="flex-1"
            >
              Aperçu
            </Button>
            
            <Button 
              onClick={handleGenerate}
              disabled={!selectedTemplate || selectedClients.length === 0}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Générer
            </Button>
          </div>
        </div>
      </div>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
        clientCount={selectedClients.length}
      />
    </div>
  );
}
