
import React from "react";
import { TabsContent as ShadcnTabsContent } from "@/components/ui/tabs";
import { GestionEntreprise } from "./GestionEntreprise";
import { GestionFiscale } from "./GestionFiscale";
import { GestionComptable } from "./GestionComptable";
import { GestionDossier } from "./GestionDossier";
import { ContratPrestations } from "./ContratPrestations";
import { ClotureExercice } from "./ClotureExercice";
import { ObligationsFiscales } from "./ObligationsFiscales";
import { OptimisationFiscale } from "./OptimisationFiscale";
import { AdministrationFiscale } from "./AdministrationFiscale";
import { Client } from "@/types/client";

interface TabsContentProps {
  activeTab: string;
  selectedClient: Client;
  selectedSubTab: string | null;
  onTabChange: (value: string) => void;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabsContent({ 
  activeTab, 
  selectedClient, 
  selectedSubTab, 
  onTabChange, 
  onSubTabSelect 
}: TabsContentProps) {
  return (
    <>
      <ShadcnTabsContent value="entreprise">
        <GestionEntreprise onTabChange={onTabChange} />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="contrat-prestations">
        <ContratPrestations client={selectedClient} />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="fiscal">
        <GestionFiscale onTabChange={onTabChange} />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="obligations-fiscales">
        <ObligationsFiscales />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="optimisation-fiscale">
        <OptimisationFiscale />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="administration-fiscale">
        <AdministrationFiscale />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="cloture-exercice">
        <ClotureExercice 
          selectedSubTab={selectedSubTab} 
          handleSubTabSelect={onSubTabSelect} 
        />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="comptable">
        <GestionComptable />
      </ShadcnTabsContent>

      <ShadcnTabsContent value="dossier">
        <GestionDossier />
      </ShadcnTabsContent>
    </>
  );
}
