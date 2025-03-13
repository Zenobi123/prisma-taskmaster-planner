
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { GestionTabsList } from "./tabs/TabsList";
import { GestionTabsContent } from "./tabs/TabsContent";
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
  // On modifie le composant pour qu'il utilise une valeur dynamique pour defaultValue
  // et pour gérer tous les types d'onglets, pas seulement les onglets principaux
  return (
    <Tabs 
      defaultValue="entreprise" 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="space-y-4"
    >
      {/* Afficher la navigation principale uniquement si on est sur un onglet principal */}
      {['entreprise', 'fiscal', 'comptable', 'dossier'].includes(activeTab) && (
        <GestionTabsList activeTab={activeTab} />
      )}
      
      {/* Afficher un bouton de retour si on est sur un sous-onglet */}
      {!['entreprise', 'fiscal', 'comptable', 'dossier'].includes(activeTab) && (
        <div className="mb-4">
          <button 
            onClick={() => {
              // Déterminer l'onglet parent en fonction du sous-onglet actif
              const fiscalTabs = ["obligations-fiscales", "optimisation-fiscale", "administration-fiscale", "cloture-exercice"];
              const entrepriseTabs = ["gestion-admin", "gestion-rh", "gestion-paie", "contrat-prestations"];
              
              if (fiscalTabs.includes(activeTab)) {
                onTabChange("fiscal");
              } else if (entrepriseTabs.includes(activeTab)) {
                onTabChange("entreprise");
              } else {
                // Par défaut, retour à l'entreprise
                onTabChange("entreprise");
              }
            }}
            className="text-sm flex items-center gap-1 text-primary hover:underline"
          >
            <span>← Retour</span>
          </button>
        </div>
      )}
      
      <GestionTabsContent
        activeTab={activeTab}
        selectedClient={selectedClient}
        selectedSubTab={selectedSubTab}
        onTabChange={onTabChange}
        onSubTabSelect={onSubTabSelect}
      />
    </Tabs>
  );
}
