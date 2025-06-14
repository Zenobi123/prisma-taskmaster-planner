
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { courrierTemplates, Template } from "@/utils/courrierTemplates";
import { generateCourrierContent } from "@/services/factureFormatService"; // Assuming this service exists
import { useCourrierData } from "@/hooks/useCourrierData"; // Assuming this hook manages data fetching
import { PageLayout } from "@/components/layout/PageLayout";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
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
    setSelectedClientIds([]); // Reset client selection when criteria change
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
          // Add more complex filtering logic based on client properties and criteria
          // For now, simple match or default to true if criteria not directly applicable
          if (key === 'status') return (client as any).status === value; // Example
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
        // Simulate sending courrier (e.g., save to DB, call an email API)
        console.log(`Courrier pour ${client.nom || client.raisonsociale}:`, content);
        // Example: await supabase.from('courriers_envoyes').insert({ client_id: client.id, template_id: selectedTemplate.id, content, custom_message: customMessage });
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
      } catch (error) {
        toast.error(`Erreur lors de l'envoi du courrier à ${client.nom || client.raisonsociale}.`);
        console.error("Courrier send error for client:", client.id, error);
      }
    }
    toast.success("Courriers envoyés avec succès !");
    setIsPreviewOpen(false); // Close preview if open
    setCustomMessage(""); // Reset custom message
  };
  
  const clientsForList = clients; // Or apply some initial filtering if needed

  return (
    <PageLayout>
      <CourrierHeader title="Gestion des Courriers" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {/* Colonne de gauche: Critères et Sélection de Clients */}
        <div className="md:col-span-1 space-y-6">
          <CriteriaSelection selectedCriteria={selectedCriteria} onCriteriaChange={handleCriteriaChange} />
          <ClientsList 
            clients={clientsForList} 
            selectedClientIds={selectedClientIds} 
            onSelectionChange={handleClientSelectionChange}
            isLoading={isLoadingClients} // Added isLoading
            selectedCriteria={selectedCriteria} // Added selectedCriteria
          />
          <TemplateSelection 
            selectedTemplateId={selectedTemplateId} 
            onTemplateChange={handleTemplateChange}
            selectedTemplate={selectedTemplate} // Added selectedTemplate
          />
        </div>

        {/* Colonne de droite: Message Personnalisé et Actions */}
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

          <div>
            <label htmlFor="generationType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de génération
            </label>
            <Select value={generationType} onValueChange={(value: "individuel" | "masse") => setGenerationType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner le type de génération" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individuel">Individuel (pour les clients sélectionnés)</SelectItem>
                <SelectItem value="masse">En masse (selon les critères)</SelectItem>
              </SelectContent>
            </Select>
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
          template={selectedTemplate} // Added template
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

