
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection";
import { TemplateSelection } from "@/components/courrier/TemplateSelection";
import { ClientsList } from "@/components/courrier/ClientsList";
import { PreviewDialog } from "@/components/courrier/PreviewDialog";
import { useCourrierData } from "@/hooks/useCourrierData";

const Courrier = () => {
  const navigate = useNavigate();
  const [selectedCriteria, setSelectedCriteria] = useState({
    type: '',
    regimeFiscal: '',
    secteurActivite: '',
    centreRattachement: '',
    statut: 'actif'
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generationType, setGenerationType] = useState<'bulk' | 'individual'>('bulk');
  
  const { filteredClients, templates, isLoading } = useCourrierData(selectedCriteria);

  const handleGenerateCorrespondence = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de courrier.",
        variant: "destructive"
      });
      return;
    }

    if (filteredClients.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun client ne correspond aux critères sélectionnés.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Génération en cours",
        description: `Génération de ${filteredClients.length} courrier(s)...`,
      });

      // Ici on peut ajouter la logique de génération des courriers
      // Pour l'instant, on simule le processus
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Courriers générés",
        description: `${filteredClients.length} courrier(s) ont été générés avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les courriers. Veuillez réessayer.",
        variant: "destructive"
      });
    }
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne des critères et modèles */}
        <div className="lg:col-span-1 space-y-6">
          <CriteriaSelection 
            criteria={selectedCriteria}
            onCriteriaChange={setSelectedCriteria}
          />
          
          <TemplateSelection
            templates={templates}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            generationType={generationType}
            onGenerationTypeChange={setGenerationType}
          />

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGenerateCorrespondence}
              disabled={!selectedTemplate || filteredClients.length === 0}
              className="w-full"
            >
              Générer {generationType === 'bulk' ? 'Publipostage' : 'Courriers Individuels'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!selectedTemplate || filteredClients.length === 0}
              className="w-full"
            >
              Aperçu
            </Button>
          </div>
        </div>

        {/* Colonne de la liste des clients */}
        <div className="lg:col-span-2">
          <ClientsList 
            clients={filteredClients}
            isLoading={isLoading}
            selectedCriteria={selectedCriteria}
          />
        </div>
      </div>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
        clients={filteredClients}
        templates={templates}
      />
    </div>
  );
};

export default Courrier;
