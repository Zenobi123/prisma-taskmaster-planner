
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Client } from "@/types/client";
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
      <CourrierHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        <div className="md:col-span-1 space-y-6">
          <CriteriaSelection 
            selectedCriteria={selectedCriteria} 
            onCriteriaChange={handleCriteriaChange}
            generationType={generationType}
            onGenerationTypeChange={setGenerationType}
          />
          <ClientsList 
            clients={clientsForList} 
            selectedClientIds={selectedClientIds} 
            onSelectionChange={handleClientSelectionChange}
            isLoading={isLoadingClients}
            selectedCriteria={selectedCriteria}
          />
          <TemplateSelection 
            selectedTemplateId={selectedTemplateId} 
            onTemplateChange={handleTemplateChange}
            selectedTemplate={selectedTemplate}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Message personnalisé (optionnel)
            </label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Ajoutez un message personnalisé qui sera inclus dans le courrier..."
              rows={4}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleGeneratePreview} variant="outline" className="flex-1">
              Prévisualiser
            </Button>
            <Button onClick={handleSendCourrier} className="flex-1 bg-primary hover:bg-primary/90">
              Envoyer le Courrier
            </Button>
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
      {clientsError && <p className="text-red-500 p-4">Erreur de chargement des clients: {clientsError.message}</p>}
    </PageLayout>
  );
};

export default Courrier;
