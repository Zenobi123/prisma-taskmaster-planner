
import React from "react";
import { GestionEntreprise } from "./GestionEntreprise";
import { GestionFiscale } from "./GestionFiscale";
import { GestionComptable } from "./GestionComptable";
import { GestionDossier } from "./GestionDossier";
import { ContratPrestations } from "./ContratPrestations";
import { ClotureExercice } from "./ClotureExercice";
import { ObligationsFiscales } from "./ObligationsFiscales";
import { Client } from "@/types/client";

// Import des nouveaux composants
import { GestionAdmin } from "./administration/GestionAdmin";
import { GestionRH } from "./rh/GestionRH";
import { GestionPaie } from "./paie/GestionPaie";

// Export components as nested objects
export const TabsContent = {
  Entreprise: ({ selectedClient, onTabChange }: { selectedClient: Client, onTabChange: (tab: string) => void }) => (
    <GestionEntreprise onTabChange={onTabChange} selectedClient={selectedClient} />
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
  
  // Modules RH, Administration et Paie
  GestionAdmin: ({ selectedClient }: { selectedClient: Client }) => (
    <GestionAdmin client={selectedClient} />
  ),
  
  GestionRH: ({ selectedClient }: { selectedClient: Client }) => (
    <GestionRH client={selectedClient} />
  ),
  
  GestionPaie: ({ selectedClient }: { selectedClient: Client }) => (
    <GestionPaie client={selectedClient} />
  ),
};
