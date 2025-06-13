
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { CourrierHeader } from "@/components/courrier/CourrierHeader";
import { ClientsList } from "@/components/courrier/ClientsList";
import { CriteriaSelection } from "@/components/courrier/CriteriaSelection";
import { TemplateSelection } from "@/components/courrier/TemplateSelection";
import { PreviewDialog } from "@/components/courrier/PreviewDialog";
import { useCourrierData } from "@/hooks/useCourrierData";

export default function Courrier() {
  const { clients, collaborateurs, isLoading, error } = useCourrierData();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-red-500">Erreur lors du chargement des données</p>
        </div>
      </PageLayout>
    );
  }

  const filteredClients = clients;

  return (
    <PageLayout>
      <div className="space-y-8">
        <CourrierHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sélection des clients */}
          <ClientsList 
            clients={filteredClients}
            selectedClients={selectedClients}
            onClientToggle={(clientId) => {
              setSelectedClients(prev => 
                prev.includes(clientId) 
                  ? prev.filter(id => id !== clientId)
                  : [...prev, clientId]
              );
            }}
          />

          {/* Sélection des critères */}
          <CriteriaSelection 
            selectedCriteria={selectedCriteria}
            onCriteriaToggle={(criteria) => {
              setSelectedCriteria(prev => 
                prev.includes(criteria) 
                  ? prev.filter(c => c !== criteria)
                  : [...prev, criteria]
              );
            }}
          />

          {/* Sélection du modèle */}
          <TemplateSelection 
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onPreview={() => setShowPreview(true)}
            disabled={selectedClients.length === 0 || !selectedTemplate}
          />
        </div>

        {/* Dialog de prévisualisation */}
        <PreviewDialog 
          open={showPreview}
          onOpenChange={setShowPreview}
          selectedClients={selectedClients.map(id => 
            clients.find(c => c.id === id)!
          )}
          selectedCriteria={selectedCriteria}
          selectedTemplate={selectedTemplate}
        />
      </div>
    </PageLayout>
  );
}
