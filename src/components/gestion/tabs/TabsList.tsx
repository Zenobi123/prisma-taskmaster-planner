
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function GestionTabsList({ activeTab, onTabChange }: TabsListProps) {
  return (
    <ShadcnTabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
      <TabsTrigger 
        value="entreprise"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary-hover hover:bg-[#F2FCE2] transition-all duration-300"
      >
        Gestion d'entreprise
      </TabsTrigger>
      <TabsTrigger 
        value="fiscal"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary-hover hover:bg-[#F2FCE2] transition-all duration-300"
      >
        Gestion fiscale
      </TabsTrigger>
      <TabsTrigger 
        value="comptable"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary-hover hover:bg-[#F2FCE2] transition-all duration-300"
      >
        Gestion comptable
      </TabsTrigger>
      <TabsTrigger 
        value="dossier"
        className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary-hover hover:bg-[#F2FCE2] transition-all duration-300"
      >
        Gestion documentaire
      </TabsTrigger>
    </ShadcnTabsList>
  );
}
