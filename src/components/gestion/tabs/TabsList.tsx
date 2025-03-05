
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
}

export function GestionTabsList({ activeTab }: TabsListProps) {
  return (
    <ShadcnTabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
      <TabsTrigger 
        value="entreprise"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
      >
        Gestion d'entreprise
      </TabsTrigger>
      <TabsTrigger 
        value="fiscal"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
      >
        Gestion fiscale
      </TabsTrigger>
      <TabsTrigger 
        value="comptable"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
      >
        Gestion comptable
      </TabsTrigger>
      <TabsTrigger 
        value="dossier"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
      >
        Gestion documentaire
      </TabsTrigger>
    </ShadcnTabsList>
  );
}
