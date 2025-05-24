
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/types/client";

interface GestionTabsProps {
  client: Client;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollPos?: number;
}

export function GestionTabs({ client, activeTab, setActiveTab, scrollPos }: GestionTabsProps) {
  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="informations" onClick={() => setActiveTab("informations")}>
          Informations
        </TabsTrigger>
        <TabsTrigger value="contacts" onClick={() => setActiveTab("contacts")}>
          Contacts
        </TabsTrigger>
        <TabsTrigger value="documents" onClick={() => setActiveTab("documents")}>
          Documents
        </TabsTrigger>
        <TabsTrigger value="comptabilite" onClick={() => setActiveTab("comptabilite")}>
          Comptabilité
        </TabsTrigger>
        <TabsTrigger value="parametres" onClick={() => setActiveTab("parametres")}>
          Paramètres
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
