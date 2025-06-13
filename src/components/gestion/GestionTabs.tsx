
import { useState, useEffect } from "react";
import TabsListWrapper from "@/components/gestion/tabs/TabsList";
import { Client } from "@/types/client";
import { TabsContent } from "@/components/gestion/tabs/TabsContent";

interface GestionTabsProps {
  activeTab: string;
  selectedClient: Client;
  selectedSubTab: string | null;
  onTabChange: (tab: string) => void;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabs({
  activeTab,
  selectedClient,
  selectedSubTab,
  onTabChange,
  onSubTabSelect,
}: GestionTabsProps) {
  const [tabContent, setTabContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    switch (activeTab) {
      case "entreprise":
        setTabContent(<TabsContent.Entreprise selectedClient={selectedClient} onTabChange={onTabChange} />);
        break;
      case "fiscal":
        setTabContent(<TabsContent.ObligationsFiscales selectedClient={selectedClient} />);
        break;
      case "comptable":
        setTabContent(<TabsContent.GestionComptable selectedClient={selectedClient} />);
        break;
      case "contrat-prestations":
        setTabContent(<TabsContent.ContratPrestations selectedClient={selectedClient} />);
        break;
      case "cloture-exercice":
        setTabContent(
          <TabsContent.ClotureExercice
            selectedClient={selectedClient}
            selectedSubTab={selectedSubTab}
            onSubTabSelect={onSubTabSelect}
          />
        );
        break;
      case "dossier":
        setTabContent(<TabsContent.GestionDossier selectedClient={selectedClient} />);
        break;
      // Ajout des nouveaux cas pour les modules Administration, RH, Paie
      case "gestion-admin":
        setTabContent(<TabsContent.GestionAdmin selectedClient={selectedClient} />);
        break;
      case "gestion-rh":
        setTabContent(<TabsContent.GestionRH selectedClient={selectedClient} />);
        break;
      case "gestion-paie":
        setTabContent(<TabsContent.GestionPaie selectedClient={selectedClient} />);
        break;
      default:
        setTabContent(<TabsContent.Entreprise selectedClient={selectedClient} onTabChange={onTabChange} />);
    }
  }, [activeTab, selectedClient, selectedSubTab, onTabChange, onSubTabSelect]);

  return (
    <div className="mt-6 space-y-6">
      <TabsListWrapper activeTab={activeTab} onTabChange={onTabChange} />
      <div className="mt-6">{tabContent}</div>
    </div>
  );
}
