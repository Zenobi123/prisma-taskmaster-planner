import React from "react";
import { Tabs } from "@/components/ui/tabs";
import TabsList from "@/components/gestion/tabs/TabsList";
import { Tab } from "@/components/ui/tab";
import { Client } from "@/types/client";

interface GestionTabsProps {
  client: Client;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollPos?: number;
}

const GestionTabs = ({ client, activeTab, setActiveTab, scrollPos }: GestionTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList scrollPos={scrollPos}>
        <Tab value="informations" onClick={() => setActiveTab("informations")}>Informations</Tab>
        <Tab value="contacts" onClick={() => setActiveTab("contacts")}>Contacts</Tab>
        <Tab value="documents" onClick={() => setActiveTab("documents")}>Documents</Tab>
        <Tab value="comptabilite" onClick={() => setActiveTab("comptabilite")}>Comptabilité</Tab>
        <Tab value="parametres" onClick={() => setActiveTab("parametres")}>Paramètres</Tab>
      </TabsList>
    </Tabs>
  );
};

export default GestionTabs;
