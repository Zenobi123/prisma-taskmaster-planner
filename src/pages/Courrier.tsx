
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection";
import { TemplateSelection } from "@/components/courrier/TemplateSelection";
import { ClientsList } from "@/components/courrier/ClientsList";
import { PreviewDialog } from "@/components/courrier/PreviewDialog";
import { useCourrierData } from "@/hooks/useCourrierData";

const Courrier = () => {
  const navigate = useNavigate();
  const [selectedCriteria, setSelectedCriteria] = useState({
    type: "",
    regimeFiscal: "",
    secteurActivite: "",
    centreRattachement: "",
    statut: "actif"
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generationType, setGenerationType] = useState("publipostage");
  const [previewOpen, setPreviewOpen] = useState(false);

  const { filteredClients, isLoading } = useCourrierData(selectedCriteria);

  const handleGenerate = () => {
    if (!selectedTemplate || filteredClients.length === 0) {
      return;
    }
    setPreviewOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <CourrierHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CriteriaSelection
            selectedCriteria={selectedCriteria}
            onCriteriaChange={setSelectedCriteria}
            generationType={generationType}
            onGenerationTypeChange={setGenerationType}
          />

          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />

          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={!selectedTemplate || filteredClients.length === 0}
              className="px-8 py-2"
            >
              Générer l'aperçu
            </Button>
          </div>
        </div>

        <div>
          <ClientsList
            clients={filteredClients}
            isLoading={isLoading}
            selectedCriteria={selectedCriteria}
          />
        </div>
      </div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={selectedTemplate}
        clients={filteredClients}
        generationType={generationType}
      />
    </div>
  );
};

export default Courrier;
