
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, Eye, Mail, Users, FileText, Filter, History, Truck } from "lucide-react";
import { courrierTemplates, Template, generateCourrierContent } from "@/utils/courrierTemplates";
import { sendCourrierWithStorage } from "@/services/courrierStorageService";
import { useCourrierData } from "@/hooks/useCourrierData";
import { CourrierModeEnvoi } from "@/types/courrier";
import PageLayout from "@/components/layout/PageLayout";
import CourrierHeader from "@/components/courrier/CourrierHeader";
import CriteriaSelection, { Criteria } from "@/components/courrier/CriteriaSelection";
import ClientsList from "@/components/courrier/ClientsList";
import TemplateSelection from "@/components/courrier/TemplateSelection";
import PreviewDialog from "@/components/courrier/PreviewDialog";
import CourrierHistorique from "@/components/courrier/CourrierHistorique";

const MODE_ENVOI_LABELS: Record<CourrierModeEnvoi, string> = {
  remise_en_main_propre: "Remise en main propre",
  courrier_postal: "Courrier postal",
  email: "Email",
  fax: "Fax",
};

const Courrier: React.FC = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>({});
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(courrierTemplates[0]?.id || "");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [generationType, setGenerationType] = useState<"individuel" | "masse">("individuel");
  const [modeEnvoi, setModeEnvoi] = useState<CourrierModeEnvoi>("remise_en_main_propre");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

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
    setSelectedClientIds([]);
  };

  const selectedTemplate = courrierTemplates.find(t => t.id === selectedTemplateId);

  const getFilteredClients = useCallback(() => {
    if (generationType === "masse") {
      return clients.filter(client =>
        Object.entries(selectedCriteria).every(([key, value]) => {
          if (!value) return true;
          if (key === "type") return client.type === value;
          if (key === "regimeFiscal") return client.regimefiscal === value;
          if (key === "secteurActivite") return client.secteuractivite === value;
          if (key === "centreRattachement") return client.centrerattachement === value;
          return true;
        })
      );
    }
    return clients.filter(client => selectedClientIds.includes(client.id));
  }, [clients, selectedClientIds, generationType, selectedCriteria]);

  const getClientsForList = useCallback(() => {
    return clients.filter(client =>
      Object.entries(selectedCriteria).every(([key, value]) => {
        if (!value) return true;
        if (key === "type") return client.type === value;
        if (key === "regimeFiscal") return client.regimefiscal === value;
        if (key === "secteurActivite") return client.secteuractivite === value;
        if (key === "centreRattachement") return client.centrerattachement === value;
        return true;
      })
    );
  }, [clients, generationType, selectedCriteria]);

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

    setIsSending(true);
    try {
      toast.info(`Envoi du courrier à ${finalClients.length} client(s)...`);
      await sendCourrierWithStorage(
        finalClients.map(client => client.id),
        selectedTemplateId,
        customMessage,
        modeEnvoi
      );
      toast.success("Courriers générés et enregistrés avec succès !");
      setIsPreviewOpen(false);
      setCustomMessage("");
      setSelectedClientIds([]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du courrier:", error);
      toast.error("Erreur lors de l'envoi du courrier. Veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  const clientsForList = getClientsForList();
  const finalClients = getFilteredClients();

  return (
    <PageLayout fullWidth>
      <div className="min-h-screen bg-gray-50">
        <CourrierHeader />

        <div className="w-full px-0.5 sm:px-1 lg:px-1.5 py-1">
          <Tabs defaultValue="redaction">
            <TabsList className="mb-3 h-8">
              <TabsTrigger value="redaction" className="text-xs gap-1.5 px-3">
                <Mail className="w-3 h-3" /> Rédaction
              </TabsTrigger>
              <TabsTrigger value="historique" className="text-xs gap-1.5 px-3">
                <History className="w-3 h-3" /> Historique
              </TabsTrigger>
            </TabsList>

            {/* ── TAB RÉDACTION ───────────────────────── */}
            <TabsContent value="redaction">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-1.5">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="pb-1.5 border-b border-gray-100">
                      <CardTitle className="flex items-center gap-1.5 text-gray-800 text-xs">
                        <Filter className="w-3 h-3 text-[#84A98C]" />
                        Critères de sélection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5">
                      <CriteriaSelection
                        selectedCriteria={selectedCriteria}
                        onCriteriaChange={handleCriteriaChange}
                        generationType={generationType}
                        onGenerationTypeChange={handleGenerationTypeChange}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Main area */}
                <div className="lg:col-span-3 space-y-1.5">
                  {/* Clients list */}
                  <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="pb-1.5 border-b border-gray-100">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-800 text-xs">
                          <Users className="w-3 h-3 text-[#84A98C]" />
                          {generationType === "individuel" ? "Sélectionner les clients" : "Clients correspondants"}
                        </div>
                        <Badge variant="secondary" className="bg-[#84A98C] text-white text-xs px-1.5 py-0.5">
                          {generationType === "individuel"
                            ? `${selectedClientIds.length}/${clientsForList.length} sélectionné${selectedClientIds.length > 1 ? "s" : ""}`
                            : `${finalClients.length} client${finalClients.length > 1 ? "s" : ""}`}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5">
                      <ClientsList
                        clients={clientsForList}
                        selectedClientIds={selectedClientIds}
                        onSelectionChange={handleClientSelectionChange}
                        isLoading={isLoadingClients}
                        selectedCriteria={selectedCriteria}
                        generationType={generationType}
                      />
                    </CardContent>
                  </Card>

                  {/* Template selection */}
                  <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="pb-1.5 border-b border-gray-100">
                      <CardTitle className="flex items-center gap-1.5 text-gray-800 text-xs">
                        <FileText className="w-3 h-3 text-[#84A98C]" />
                        Modèles de courrier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5">
                      <TemplateSelection
                        selectedTemplateId={selectedTemplateId}
                        onTemplateChange={handleTemplateChange}
                        selectedTemplate={selectedTemplate}
                      />
                    </CardContent>
                  </Card>

                  {/* Custom message + mode envoi */}
                  <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="pb-1.5 border-b border-gray-100">
                      <CardTitle className="flex items-center gap-1.5 text-gray-800 text-xs">
                        <FileText className="w-3 h-3 text-[#84A98C]" />
                        Message & envoi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Message personnalisé</Label>
                        <Textarea
                          value={customMessage}
                          onChange={e => setCustomMessage(e.target.value)}
                          placeholder="Ajoutez un message personnalisé qui sera inclus dans le courrier..."
                          rows={2}
                          className="border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C] text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Mode d'envoi
                        </Label>
                        <Select
                          value={modeEnvoi}
                          onValueChange={v => setModeEnvoi(v as CourrierModeEnvoi)}
                        >
                          <SelectTrigger className="h-8 text-xs border-gray-300 focus:border-[#84A98C]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(MODE_ENVOI_LABELS) as [CourrierModeEnvoi, string][]).map(
                              ([val, label]) => (
                                <SelectItem key={val} value={val} className="text-xs">
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="pb-1.5 border-b border-gray-100">
                      <CardTitle className="flex items-center gap-1.5 text-gray-800 text-xs">
                        <Mail className="w-3 h-3 text-[#84A98C]" />
                        Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5">
                      <div className="flex flex-col sm:flex-row gap-1.5">
                        <Button
                          onClick={handleGeneratePreview}
                          variant="outline"
                          className="flex-1 border-[#84A98C] text-[#84A98C] hover:bg-[#84A98C] hover:text-white text-xs px-2 py-1.5"
                          disabled={!selectedTemplate || finalClients.length === 0}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Prévisualiser
                        </Button>
                        <Button
                          onClick={handleSendCourrier}
                          className="flex-1 bg-[#84A98C] hover:bg-[#6B8E74] text-white text-xs px-2 py-1.5"
                          disabled={!selectedTemplate || finalClients.length === 0 || isSending}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          {isSending ? "Génération en cours..." : "Générer & Enregistrer"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ── TAB HISTORIQUE ──────────────────────── */}
            <TabsContent value="historique">
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-1.5 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-1.5 text-gray-800 text-xs">
                    <History className="w-3 h-3 text-[#84A98C]" />
                    Historique des courriers
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <CourrierHistorique />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
          <div className="w-full px-0.5 sm:px-1 lg:px-1.5">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-1.5">
                <p className="text-red-600 text-xs">Erreur de chargement des clients: {clientsError.message}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Courrier;
