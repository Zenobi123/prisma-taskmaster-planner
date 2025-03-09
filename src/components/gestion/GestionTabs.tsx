
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionFiscale } from "./tabs/GestionFiscale";
import { GestionEntreprise } from "./tabs/GestionEntreprise";
import { GestionDossier } from "./tabs/GestionDossier";
import { GestionComptable } from "./tabs/GestionComptable";
import { ContratPrestations } from "./tabs/ContratPrestations";
import { TabsContent as FiscalTabsContent } from "./tabs/TabsContent";
import { TabsList as FiscalTabsList } from "./tabs/TabsList";
import { Client } from "@/types/client";
import { useSearchParams } from "react-router-dom";

interface GestionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedClient: Client;
  selectedSubTab: string | null;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabs({
  activeTab,
  onTabChange,
  selectedClient,
  selectedSubTab,
  onSubTabSelect
}: GestionTabsProps) {
  const [searchParams] = useSearchParams();

  // Détecte les paramètres dans l'URL pour l'onglet et le sous-onglet
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const subTabParam = searchParams.get("subtab");
    
    if (tabParam && ["entreprise", "fiscale", "comptable", "dossier", "prestations"].includes(tabParam)) {
      onTabChange(tabParam);
      
      if (tabParam === "fiscale" && subTabParam) {
        onSubTabSelect(subTabParam);
      }
    }
  }, [searchParams, onTabChange, onSubTabSelect]);

  return (
    <div className="mt-6">
      <Tabs defaultValue="entreprise" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="entreprise">
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="fiscale">
            Fiscale
          </TabsTrigger>
          <TabsTrigger value="comptable">
            Comptable
          </TabsTrigger>
          <TabsTrigger value="dossier">
            Dossier
          </TabsTrigger>
          <TabsTrigger value="prestations">
            Contrat / Prestations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entreprise">
          <GestionEntreprise />
        </TabsContent>

        <TabsContent value="fiscale">
          {selectedSubTab ? (
            <div className="space-y-6">
              <FiscalTabsList activeTab={selectedSubTab} onChange={onSubTabSelect} />
              <FiscalTabsContent 
                activeTab={selectedSubTab} 
                selectedClient={selectedClient}
              />
            </div>
          ) : (
            <GestionFiscale onTabChange={onSubTabSelect} />
          )}
        </TabsContent>

        <TabsContent value="comptable">
          <GestionComptable />
        </TabsContent>

        <TabsContent value="dossier">
          <GestionDossier />
        </TabsContent>

        <TabsContent value="prestations">
          <ContratPrestations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
