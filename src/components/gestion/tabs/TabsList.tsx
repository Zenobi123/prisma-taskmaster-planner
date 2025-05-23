
import { Tabs, TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

interface TabsListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabsList({ activeTab, onTabChange }: TabsListProps) {
  const isMobile = useIsMobile();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Scroll to active tab on mobile
  useEffect(() => {
    if (isMobile) {
      const activeTabElement = document.querySelector(`[data-state="active"][data-value="${activeTab}"]`);
      if (activeTabElement) {
        const tabsContainer = activeTabElement.parentElement;
        if (tabsContainer) {
          const tabRect = (activeTabElement as HTMLElement).getBoundingClientRect();
          const containerRect = tabsContainer.getBoundingClientRect();
          setScrollPosition(tabRect.left - containerRect.left - (containerRect.width / 2) + (tabRect.width / 2));
        }
      }
    }
  }, [activeTab, isMobile]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      {isMobile ? (
        <ScrollArea 
          className="w-full overflow-x-auto"
          scrollPos={scrollPosition}
        >
          <ShadcnTabsList className="inline-flex min-w-max border-b border-gray-200 pb-1 w-auto">
            <TabsTrigger 
              value="entreprise"
              className="data-[state=active]:bg-primary whitespace-nowrap"
            >
              Entreprise
            </TabsTrigger>
            <TabsTrigger 
              value="fiscal"
              className="data-[state=active]:bg-primary whitespace-nowrap"
            >
              Fiscal
            </TabsTrigger>
            <TabsTrigger 
              value="comptable"
              className="data-[state=active]:bg-primary whitespace-nowrap"
            >
              Comptable
            </TabsTrigger>
            <TabsTrigger 
              value="cloture-exercice"
              className="data-[state=active]:bg-primary whitespace-nowrap"
            >
              Clôture
            </TabsTrigger>
            <TabsTrigger 
              value="dossier"
              className="data-[state=active]:bg-primary whitespace-nowrap"
            >
              Dossier
            </TabsTrigger>
            <TabsTrigger 
              value="contrat-prestations"
              className="data-[state=active]:bg-primary whitespace-nowrap"
            >
              Contrat
            </TabsTrigger>
            
            {/* Les nouveaux onglets sont masqués dans la navigation principale 
                mais accessibles via les cartes dans la section Entreprise */}
            {activeTab === "gestion-admin" && (
              <TabsTrigger 
                value="gestion-admin"
                className="data-[state=active]:bg-primary whitespace-nowrap"
              >
                Administration
              </TabsTrigger>
            )}
            {activeTab === "gestion-rh" && (
              <TabsTrigger 
                value="gestion-rh"
                className="data-[state=active]:bg-primary whitespace-nowrap"
              >
                RH
              </TabsTrigger>
            )}
            {activeTab === "gestion-paie" && (
              <TabsTrigger 
                value="gestion-paie"
                className="data-[state=active]:bg-primary whitespace-nowrap"
              >
                Paie
              </TabsTrigger>
            )}
          </ShadcnTabsList>
        </ScrollArea>
      ) : (
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
          
          {/* Les nouveaux onglets sont masqués dans la navigation principale 
              mais accessibles via les cartes dans la section Entreprise */}
          <TabsTrigger 
            value="gestion-admin"
            className="hidden data-[state=active]:bg-primary data-[state=active]:flex"
          >
            Administration
          </TabsTrigger>
          <TabsTrigger 
            value="gestion-rh"
            className="hidden data-[state=active]:bg-primary data-[state=active]:flex"
          >
            RH
          </TabsTrigger>
          <TabsTrigger 
            value="gestion-paie"
            className="hidden data-[state=active]:bg-primary data-[state=active]:flex"
          >
            Paie
          </TabsTrigger>
        </ShadcnTabsList>
      )}
    </Tabs>
  );
}
