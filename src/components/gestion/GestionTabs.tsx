
import React from "react";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import TabsList from "@/components/gestion/tabs/TabsList";
import { Client } from "@/types/client";

interface GestionTabsProps {
  client: Client;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollPos?: number;
}

export function GestionTabs({ client, activeTab, setActiveTab, scrollPos }: GestionTabsProps) {
  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList scrollPos={scrollPos}>
        <TabsTrigger value="informations" onClick={() => setActiveTab("informations")}>Informations</TabsTrigger>
        <TabsTrigger value="contacts" onClick={() => setActiveTab("contacts")}>Contacts</TabsTrigger>
        <TabsTrigger value="documents" onClick={() => setActiveTab("documents")}>Documents</TabsTrigger>
        <TabsTrigger value="comptabilite" onClick={() => setActiveTab("comptabilite")}>Comptabilité</TabsTrigger>
        <TabsTrigger value="parametres" onClick={() => setActiveTab("parametres")}>Paramètres</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
