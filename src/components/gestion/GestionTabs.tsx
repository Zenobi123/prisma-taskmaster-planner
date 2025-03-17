
import React, { useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { GestionTabsList } from "./tabs/TabsList";
import { TabsContent as CustomTabsContent } from "@/components/gestion/tabs/TabsContent";
import { Client } from "@/types/client";
import { useLocation } from "react-router-dom";

interface GestionTabsProps {
  activeTab: string;
  selectedClient: Client;
  selectedSubTab: string | null;
  onTabChange: (value: string) => void;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabs({
  activeTab,
  selectedClient,
  selectedSubTab,
  onTabChange,
  onSubTabSelect,
}: GestionTabsProps) {
  const location = useLocation();

  // Handle URL query parameters to set the active tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      // Map URL parameter to tab value
      const tabMapping: Record<string, string> = {
        'entreprise': 'entreprise',
        'obligations-fiscales': 'fiscal'
      };
      
      const tabValue = tabMapping[tabParam];
      if (tabValue) {
        onTabChange(tabValue);
      }
    }
  }, [location.search, onTabChange]);

  return (
    <Tabs
      defaultValue="entreprise"
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <GestionTabsList activeTab={activeTab} onTabChange={onTabChange} />
      <TabsContent value="entreprise">
        <CustomTabsContent.Entreprise selectedClient={selectedClient} />
      </TabsContent>
      <TabsContent value="fiscal">
        <CustomTabsContent.ObligationsFiscales selectedClient={selectedClient} />
      </TabsContent>
      <TabsContent value="comptable">
        <CustomTabsContent.GestionComptable selectedClient={selectedClient} />
      </TabsContent>
      <TabsContent value="prestation">
        <CustomTabsContent.ContratPrestations selectedClient={selectedClient} />
      </TabsContent>
      <TabsContent value="cloture">
        <CustomTabsContent.ClotureExercice
          selectedClient={selectedClient}
          selectedSubTab={selectedSubTab}
          onSubTabSelect={onSubTabSelect}
        />
      </TabsContent>
      <TabsContent value="dossier">
        <CustomTabsContent.GestionDossier selectedClient={selectedClient} />
      </TabsContent>
    </Tabs>
  );
}
