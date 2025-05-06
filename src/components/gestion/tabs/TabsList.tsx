
import { Tabs, TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabsList({ activeTab, onTabChange }: TabsListProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <ShadcnTabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
        <TabsTrigger 
          value="entreprise"
          className="data-[state=active]:bg-primary"
        >
          Entreprise
        </TabsTrigger>
        <TabsTrigger 
          value="fiscal"
          className="data-[state=active]:bg-primary"
        >
          Fiscal
        </TabsTrigger>
        <TabsTrigger 
          value="comptable"
          className="data-[state=active]:bg-primary"
        >
          Comptable
        </TabsTrigger>
        <TabsTrigger 
          value="cloture-exercice"
          className="data-[state=active]:bg-primary"
        >
          Clôture
        </TabsTrigger>
        <TabsTrigger 
          value="dossier"
          className="data-[state=active]:bg-primary"
        >
          Dossier
        </TabsTrigger>
        <TabsTrigger 
          value="contrat-prestations"
          className="data-[state=active]:bg-primary"
        >
          Contrat
        </TabsTrigger>
        
        {/* Modules accessibles directement quand actifs ou via les cartes dans Entreprise */}
        <TabsTrigger 
          value="gestion-admin"
          className="data-[state=active]:flex data-[state=active]:bg-primary hidden"
        >
          Administration
        </TabsTrigger>
        <TabsTrigger 
          value="gestion-rh"
          className="data-[state=active]:flex data-[state=active]:bg-primary hidden"
        >
          RH
        </TabsTrigger>
        <TabsTrigger 
          value="gestion-paie"
          className="data-[state=active]:flex data-[state=active]:bg-primary hidden"
        >
          Paie
        </TabsTrigger>
      </ShadcnTabsList>
    </Tabs>
  );
}
