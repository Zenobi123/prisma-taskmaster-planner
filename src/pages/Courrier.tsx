
import { useState } from "react";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { TemplateSelection } from "@/components/courrier/TemplateSelection";
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection";
import { ClientsList } from "@/components/courrier/ClientsList";
import { PreviewDialog } from "@/components/courrier/PreviewDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCourrierData } from "@/hooks/useCourrierData";
import { Client } from "@/types/client";

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
  const [generationType, setGenerationType] = useState("publipostage");

  const { clients, isLoading } = useCourrierData();

  // Filter clients based on criteria
  const filteredClients = clients.filter((client: Client) => {
    if (filterCriteria.type && client.type !== filterCriteria.type) return false;
    if (filterCriteria.regimeFiscal && client.regimefiscal !== filterCriteria.regimeFiscal) return false;
    if (filterCriteria.secteurActivite && client.secteuractivite !== filterCriteria.secteurActivite) return false;
    if (filterCriteria.centreRattachement && client.centrerattachement !== filterCriteria.centreRattachement) return false;
    if (filterCriteria.statut && client.statut !== filterCriteria.statut) return false;
    return true;
  });

  const selectedClientObjects = filteredClients.filter(client => selectedClients.includes(client.id));

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleCriteriaChange = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  const handleClientSelectionChange = (clientIds: string[]) => {
    setSelectedClients(clientIds);
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleGenerate = () => {
    console.log("Generating documents for:", {
      template: selectedTemplate,
      criteria: filterCriteria,
      clients: selectedClients,
      generationType
    });
  };

  return (
    <div className="p-8 space-y-8">
      <CourrierHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateSelect}
          />
          
          <CriteriaSelection
            selectedCriteria={filterCriteria}
            onCriteriaChange={handleCriteriaChange}
            generationType={generationType}
            onGenerationTypeChange={setGenerationType}
          />
        </div>
        
        <div className="space-y-6">
          <ClientsList
            clients={filteredClients}
            selectedClients={selectedClients}
            onClientSelectionChange={handleClientSelectionChange}
            onPreview={handlePreview}
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
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        template={selectedTemplate}
        clients={selectedClientObjects}
        generationType={generationType}
      />
    </div>
  );
}
