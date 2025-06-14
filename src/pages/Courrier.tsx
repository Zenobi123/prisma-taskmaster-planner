
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Eye, Mail, Users, FileText } from "lucide-react";
import { courrierTemplates, Template, generateCourrierContent } from "@/utils/courrierTemplates";
import { useCourrierData } from "@/hooks/useCourrierData";
import PageLayout from "@/components/layout/PageLayout";
import CourrierHeader from "@/components/courrier/CourrierHeader";
import CriteriaSelection, { Criteria } from "@/components/courrier/CriteriaSelection";
import ClientsList from "@/components/courrier/ClientsList";
import TemplateSelection from "@/components/courrier/TemplateSelection";
import PreviewDialog from "@/components/courrier/PreviewDialog";

const Courrier: React.FC = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>({});
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(courrierTemplates[0]?.id || "");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [generationType, setGenerationType] = useState<"individuel" | "masse">("individuel");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const { clients, isLoading: isLoadingClients, error: clientsError } = useCourrierData(selectedCriteria);

  const handleCriteriaChange = (criteria: Criteria) => {
    setSelectedCriteria(criteria);
    setSelectedClientIds([]);
  };

  const handleClientSelectionChange = (ids: string[]) => {
    setSelectedClientIds(ids);
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
  };

  const handleGenerationTypeChange = (type: "individuel" | "masse") => {
    setGenerationType(type);
  };

  const selectedTemplate = courrierTemplates.find(t => t.id === selectedTemplateId);

  const getFilteredClients = useCallback(() => {
    if (generationType === "masse") {
      return clients.filter(client => 
        Object.entries(selectedCriteria).every(([key, value]) => {
          if (!value) return true;
          if (key === 'type') return client.type === value;
          if (key === 'regimeFiscal') return client.regimefiscal === value;
          if (key === 'secteurActivite') return client.secteuractivite === value;
          if (key === 'centreRattachement') return client.centrerattachement === value;
          return true; 
        })
      );
    }
    return clients.filter(client => selectedClientIds.includes(client.id));
  }, [clients, selectedClientIds, generationType, selectedCriteria]);

  const handleGeneratePreview = () => {
    if (!selectedTemplate) {
      toast.error("Veuillez sélectionner un modèle.");
      return;
    }
    if (getFilteredClients().length === 0) {
      toast.error("Veuillez sélectionner au moins un client.");
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleSendCourrier = async () => {
    if (!selectedTemplate) {
      toast.error("Veuillez sélectionner un modèle.");
      return;
    }
    const finalClients = getFilteredClients();
    if (finalClients.length === 0) {
      toast.error("Veuillez sélectionner au moins un client.");
      return;
    }

    toast.info(`Envoi du courrier à ${finalClients.length} client(s)...`);

    for (const client of finalClients) {
      try {
        const content = generateCourrierContent(client, selectedTemplate, customMessage);
        console.log(`Courrier pour ${client.nom || client.raisonsociale}:`, content);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        toast.error(`Erreur lors de l'envoi du courrier à ${client.nom || client.raisonsociale}.`);
        console.error("Courrier send error for client:", client.id, error);
      }
    }
    toast.success("Courriers envoyés avec succès !");
    setIsPreviewOpen(false);
    setCustomMessage("");
  };
  
  const clientsForList = getFilteredClients();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <CourrierHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar avec les critères et la liste des clients */}
            <div className="lg:col-span-1 space-y-6">
              <CriteriaSelection 
                selectedCriteria={selectedCriteria} 
                onCriteriaChange={handleCriteriaChange}
                generationType={generationType}
                onGenerationTypeChange={handleGenerationTypeChange}
              />
              
              <ClientsList 
                clients={clientsForList} 
                selectedClientIds={selectedClientIds} 
                onSelectionChange={handleClientSelectionChange}
                isLoading={isLoadingClients}
                selectedCriteria={selectedCriteria}
              />
            </div>

            {/* Zone principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sélection du modèle */}
              <TemplateSelection 
                selectedTemplateId={selectedTemplateId} 
                onTemplateChange={handleTemplateChange}
                selectedTemplate={selectedTemplate}
              />

              {/* Message personnalisé */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Message personnalisé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Ajoutez un message personnalisé qui sera inclus dans le courrier..."
                    rows={4}
                    className="resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </CardContent>
              </Card>

              {/* Résumé et actions */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-green-600" />
                      Résumé de l'envoi
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Users className="w-3 h-3 mr-1" />
                        {clientsForList.length} destinataire{clientsForList.length > 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">
                        {generationType === "masse" ? "Publipostage" : "Individuel"}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Modèle sélectionné :</h4>
                      <p className="text-gray-600">{selectedTemplate?.title || "Aucun modèle sélectionné"}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleGeneratePreview} 
                        variant="outline" 
                        className="flex-1 h-12 border-blue-200 text-blue-700 hover:bg-blue-50"
                        disabled={!selectedTemplate || clientsForList.length === 0}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Prévisualiser
                      </Button>
                      <Button 
                        onClick={handleSendCourrier} 
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                        disabled={!selectedTemplate || clientsForList.length === 0}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer le Courrier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {selectedTemplate && (
          <PreviewDialog
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            clients={getFilteredClients()}
            templateId={selectedTemplateId}
            template={selectedTemplate}
            customMessage={customMessage}
            generationType={generationType}
            onConfirmSend={handleSendCourrier}
          />
        )}
        
        {clientsError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600">Erreur de chargement des clients: {clientsError.message}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Courrier;
