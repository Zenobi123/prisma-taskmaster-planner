
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { GestionTabsList } from "./tabs/TabsList";
import { GestionTabsContent } from "./tabs/TabsContent";
import { Client } from "@/types/client";

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
  onSubTabSelect 
}: GestionTabsProps) {
  return (
    <Tabs 
      defaultValue="entreprise" 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="space-y-4"
    >
      <GestionTabsList activeTab={activeTab} />
      
      <GestionTabsContent
        activeTab={activeTab}
        selectedClient={selectedClient}
        selectedSubTab={selectedSubTab}
        onTabChange={onTabChange}
        onSubTabSelect={onSubTabSelect}
      />
    </Tabs>
  );
}
