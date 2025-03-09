
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GestionFiscale } from "./tabs/GestionFiscale";
import { GestionEntreprise } from "./tabs/GestionEntreprise";
import { GestionDossier } from "./tabs/GestionDossier";
import { GestionComptable } from "./tabs/GestionComptable";
import { ContratPrestations } from "./tabs/ContratPrestations";
import { Client } from "@/types/client";
import { useSearchParams } from "react-router-dom";

interface GestionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedClient: Client;
  selectedSubTab: string | null;
  onSubTabSelect: (subTab: string) => void;
}

export function GestionTabs({
  activeTab,
  onTabChange,
  selectedClient,
  selectedSubTab,
  onSubTabSelect
}: GestionTabsProps) {
  const [searchParams] = useSearchParams();

  // Détecte les paramètres dans l'URL pour l'onglet et le sous-onglet
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const subTabParam = searchParams.get("subtab");
    
    if (tabParam && ["entreprise", "fiscale", "comptable", "dossier", "prestations"].includes(tabParam)) {
      onTabChange(tabParam);
      
      if (tabParam === "fiscale" && subTabParam) {
        onSubTabSelect(subTabParam);
      }
    }
  }, [searchParams, onTabChange, onSubTabSelect]);

  return (
    <div className="mt-6">
      <Tabs defaultValue="entreprise" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="entreprise">
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="fiscale">
            Fiscale
          </TabsTrigger>
          <TabsTrigger value="comptable">
            Comptable
          </TabsTrigger>
          <TabsTrigger value="dossier">
            Dossier
          </TabsTrigger>
          <TabsTrigger value="prestations">
            Contrat / Prestations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entreprise">
          <GestionEntreprise onTabChange={onTabChange} />
        </TabsContent>

        <TabsContent value="fiscale">
          {selectedSubTab ? (
            <div className="space-y-6">
              <div className="flex space-x-2 bg-muted/40 p-1 rounded-lg">
                <button 
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${selectedSubTab === 'administration' ? 'bg-background shadow' : 'hover:bg-muted/60'}`}
                  onClick={() => onSubTabSelect('administration')}
                >
                  Administration fiscale
                </button>
                <button 
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${selectedSubTab === 'obligations' ? 'bg-background shadow' : 'hover:bg-muted/60'}`}
                  onClick={() => onSubTabSelect('obligations')}
                >
                  Obligations fiscales
                </button>
                <button 
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${selectedSubTab === 'optimisation' ? 'bg-background shadow' : 'hover:bg-muted/60'}`}
                  onClick={() => onSubTabSelect('optimisation')}
                >
                  Optimisation fiscale
                </button>
              </div>
              
              {selectedSubTab === 'administration' && (
                <div>
                  {/* Administration fiscale content */}
                  <div className="space-y-6">
                    <div className="text-sm">
                      Gestion des documents fiscaux, attestations et procédures administratives pour {selectedClient?.raisonsociale || selectedClient?.nom}.
                    </div>
                    <div className="space-y-6">
                      <FiscalContent selectedClient={selectedClient} />
                    </div>
                  </div>
                </div>
              )}
              
              {selectedSubTab === 'obligations' && (
                <div>
                  {/* Obligations fiscales content */}
                  <div className="space-y-6">
                    <div className="text-sm">
                      Suivi des obligations fiscales pour {selectedClient?.raisonsociale || selectedClient?.nom}.
                    </div>
                    <ObligationsFiscales client={selectedClient} />
                  </div>
                </div>
              )}
              
              {selectedSubTab === 'optimisation' && (
                <div>
                  {/* Optimisation fiscale content */}
                  <div className="space-y-6">
                    <div className="text-sm">
                      Stratégies d'optimisation fiscale pour {selectedClient?.raisonsociale || selectedClient?.nom}.
                    </div>
                    <OptimisationFiscale client={selectedClient} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <GestionFiscale onTabChange={onSubTabSelect} />
          )}
        </TabsContent>

        <TabsContent value="comptable">
          <GestionComptable />
        </TabsContent>

        <TabsContent value="dossier">
          <GestionDossier />
        </TabsContent>

        <TabsContent value="prestations">
          <ContratPrestations client={selectedClient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import necessary missing components
import { FiscalContent } from "./tabs/fiscale/FiscalContent";
import { ObligationsFiscales } from "./tabs/ObligationsFiscales";
import { OptimisationFiscale } from "./tabs/OptimisationFiscale";
