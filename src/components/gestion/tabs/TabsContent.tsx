
import React from "react";
import { GestionEntreprise } from "./GestionEntreprise";
import { GestionFiscale } from "./GestionFiscale";
import { GestionComptable } from "./GestionComptable";
import { GestionDossier } from "./GestionDossier";
import { ContratPrestations } from "./ContratPrestations";
import { ClotureExercice } from "./ClotureExercice";
import { ObligationsFiscales } from "./ObligationsFiscales";
import { Client } from "@/types/client";

// Interface for the Entreprise tab props
interface GestionEntrepriseProps {
  selectedClient: Client;
}

// Export components as nested objects
export const TabsContent = {
  Entreprise: ({ selectedClient }: GestionEntrepriseProps) => (
    <GestionEntreprise selectedClient={selectedClient} />
  ),
  
  ObligationsFiscales: ({ selectedClient }: { selectedClient: Client }) => (
    <ObligationsFiscales selectedClient={selectedClient} />
  ),
  
  GestionComptable: ({ selectedClient }: { selectedClient: Client }) => (
    <GestionComptable selectedClient={selectedClient} />
  ),
  
  ContratPrestations: ({ selectedClient }: { selectedClient: Client }) => (
    <ContratPrestations client={selectedClient} />
  ),
  
  ClotureExercice: ({ 
    selectedClient, 
    selectedSubTab, 
    onSubTabSelect 
  }: { 
    selectedClient: Client; 
    selectedSubTab: string | null; 
    onSubTabSelect: (subTab: string) => void; 
  }) => (
    <ClotureExercice 
      selectedClient={selectedClient}
      selectedSubTab={selectedSubTab} 
      handleSubTabSelect={onSubTabSelect} 
    />
  ),
  
  GestionDossier: ({ selectedClient }: { selectedClient: Client }) => (
    <GestionDossier selectedClient={selectedClient} />
  ),
};
