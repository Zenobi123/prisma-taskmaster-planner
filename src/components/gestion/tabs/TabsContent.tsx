
import React from "react";
import { TabsContent as ShadcnTabsContent } from "@/components/ui/tabs";
import { GestionEntreprise } from "./GestionEntreprise";
import { GestionFiscale } from "./GestionFiscale";
import { GestionComptable } from "./GestionComptable";
import { GestionDossier } from "./GestionDossier";
import { ContratPrestations } from "./ContratPrestations";
import { ClotureExercice } from "./ClotureExercice";
import { ObligationsFiscales } from "./ObligationsFiscales";
import { OptimisationFiscale } from "./OptimisationFiscale";
import { AdministrationFiscale } from "./AdministrationFiscale";
import { Client } from "@/types/client";

interface TabsContentProps {
  activeTab: string;
  selectedClient: Client;
  selectedSubTab: string | null;
  onTabChange: (value: string) => void;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabsContent({ 
  activeTab, 
  selectedClient, 
  selectedSubTab, 
  onTabChange, 
  onSubTabSelect 
}: TabsContentProps) {
  // Grouper les tabs par catégorie pour une meilleure organisation
  const mainTabs = ["entreprise", "fiscal", "comptable", "dossier"];
  const entrepriseTabs = ["gestion-admin", "gestion-rh", "gestion-paie", "contrat-prestations"];
  const fiscalTabs = ["obligations-fiscales", "optimisation-fiscale", "administration-fiscale", "cloture-exercice"];
  
  const renderContent = () => {
    // Tabs principales
    if (activeTab === "entreprise") return <GestionEntreprise onTabChange={onTabChange} />;
    if (activeTab === "fiscal") return <GestionFiscale onTabChange={onTabChange} />;
    if (activeTab === "comptable") return <GestionComptable />;
    if (activeTab === "dossier") return <GestionDossier />;
    
    // Sous-tabs d'entreprise
    if (activeTab === "contrat-prestations") return <ContratPrestations client={selectedClient} />;
    
    // Sous-tabs fiscales
    if (activeTab === "obligations-fiscales") return <ObligationsFiscales />;
    if (activeTab === "optimisation-fiscale") return <OptimisationFiscale />;
    if (activeTab === "administration-fiscale") return <AdministrationFiscale />;
    if (activeTab === "cloture-exercice") {
      return (
        <ClotureExercice
          selectedSubTab={selectedSubTab}
          handleSubTabSelect={onSubTabSelect}
        />
      );
    }
    
    // Par défaut
    return <GestionEntreprise onTabChange={onTabChange} />;
  };

  return (
    <ShadcnTabsContent value={activeTab}>
      {renderContent()}
    </ShadcnTabsContent>
  );
}
