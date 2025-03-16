
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ContratPrestations } from "./ContratPrestations";
import { GestionEntreprise } from "./GestionEntreprise";
import { GestionComptable } from "./GestionComptable";
import { GestionFiscale } from "./GestionFiscale";
import { GestionDossier } from "./GestionDossier";
import { ObligationsFiscales } from "./ObligationsFiscales";
import { ClotureExercice } from "./ClotureExercice";
import { Client } from "@/types/client";

interface GestionTabsContentProps {
  activeTab: string;
  selectedClient: Client;
  selectedSubTab: string | null;
  onTabChange: (tab: string) => void;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabsContent({
  activeTab,
  selectedClient,
  selectedSubTab,
  onTabChange,
  onSubTabSelect
}: GestionTabsContentProps) {
  return (
    <>
      <TabsContent value="entreprise" className="space-y-4">
        <GestionEntreprise onTabChange={onTabChange} />
      </TabsContent>
      
      <TabsContent value="comptable" className="space-y-4">
        <GestionComptable />
      </TabsContent>
      
      <TabsContent value="fiscale" className="space-y-4">
        <GestionFiscale onTabChange={onTabChange} />
      </TabsContent>
      
      <TabsContent value="obligations-fiscales" className="space-y-4">
        <ObligationsFiscales selectedClient={selectedClient} />
      </TabsContent>
      
      <TabsContent value="cloture-exercice" className="space-y-4">
        <ClotureExercice 
          selectedSubTab={selectedSubTab} 
          handleSubTabSelect={onSubTabSelect} 
        />
      </TabsContent>
      
      <TabsContent value="dossier" className="space-y-4">
        <GestionDossier />
      </TabsContent>
      
      <TabsContent value="contrat" className="space-y-4">
        <ContratPrestations client={selectedClient} />
      </TabsContent>
    </>
  );
}
