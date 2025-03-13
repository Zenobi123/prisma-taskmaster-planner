
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { GestionEntreprise } from "./GestionEntreprise";
import { GestionFiscale } from "./GestionFiscale";
import { GestionComptable } from "./GestionComptable";
import { GestionDossier } from "./GestionDossier";
import { ObligationsFiscales } from "./ObligationsFiscales";
import { OptimisationFiscale } from "./OptimisationFiscale";
import { AdministrationFiscale } from "./AdministrationFiscale";
import { ClotureExercice } from "./ClotureExercice";
import { ContratPrestations } from "./ContratPrestations";
import { Client } from "@/types/client";

interface GestionTabsContentProps {
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
}: GestionTabsContentProps) {
  return (
    <>
      {/* Onglets principaux */}
      <TabsContent value="entreprise" className="space-y-4">
        <GestionEntreprise 
          client={selectedClient}
          onSubTabSelect={onSubTabSelect}
        />
      </TabsContent>
      
      <TabsContent value="fiscal" className="space-y-4">
        <GestionFiscale 
          client={selectedClient}
          onSubTabSelect={onSubTabSelect}
        />
      </TabsContent>
      
      <TabsContent value="comptable" className="space-y-4">
        <GestionComptable />
      </TabsContent>
      
      <TabsContent value="dossier" className="space-y-4">
        <GestionDossier />
      </TabsContent>
      
      {/* Sous-onglets fiscaux */}
      <TabsContent value="obligations-fiscales" className="space-y-4">
        <ObligationsFiscales client={selectedClient} />
      </TabsContent>
      
      <TabsContent value="optimisation-fiscale" className="space-y-4">
        <OptimisationFiscale client={selectedClient} />
      </TabsContent>
      
      <TabsContent value="administration-fiscale" className="space-y-4">
        <AdministrationFiscale client={selectedClient} />
      </TabsContent>
      
      <TabsContent value="cloture-exercice" className="space-y-4">
        <ClotureExercice client={selectedClient} />
      </TabsContent>
      
      {/* Sous-onglets entreprise */}
      <TabsContent value="contrat-prestations" className="space-y-4">
        <ContratPrestations client={selectedClient} />
      </TabsContent>
    </>
  );
}
