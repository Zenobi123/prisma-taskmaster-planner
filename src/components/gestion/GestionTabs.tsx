
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionEntreprise } from "./tabs/GestionEntreprise";
import { GestionFiscale } from "./tabs/GestionFiscale";
import { GestionComptable } from "./tabs/GestionComptable";
import { GestionDossier } from "./tabs/GestionDossier";
import { ContratPrestations } from "./tabs/ContratPrestations";
import { ClotureExercice } from "./tabs/ClotureExercice";
import { ObligationsFiscales } from "./tabs/ObligationsFiscales";
import { OptimisationFiscale } from "./tabs/OptimisationFiscale";
import { AdministrationFiscale } from "./tabs/AdministrationFiscale";
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
      <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
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
      </TabsList>
      
      <TabsContent value="entreprise">
        <GestionEntreprise onTabChange={onTabChange} />
      </TabsContent>

      <TabsContent value="contrat-prestations">
        <ContratPrestations client={selectedClient} />
      </TabsContent>

      <TabsContent value="fiscal">
        <GestionFiscale onTabChange={onTabChange} />
      </TabsContent>

      <TabsContent value="obligations-fiscales">
        <ObligationsFiscales />
      </TabsContent>

      <TabsContent value="optimisation-fiscale">
        <OptimisationFiscale />
      </TabsContent>

      <TabsContent value="administration-fiscale">
        <AdministrationFiscale />
      </TabsContent>

      <TabsContent value="cloture-exercice">
        <ClotureExercice 
          selectedSubTab={selectedSubTab} 
          handleSubTabSelect={onSubTabSelect} 
        />
      </TabsContent>

      <TabsContent value="comptable">
        <GestionComptable />
      </TabsContent>

      <TabsContent value="dossier">
        <GestionDossier />
      </TabsContent>
    </Tabs>
  );
}
