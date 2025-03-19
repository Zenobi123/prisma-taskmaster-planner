
import { useState } from "react";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacturesManagement } from "@/components/facturation/sections/FacturesManagement";
import { PaiementsManagement } from "@/components/facturation/sections/PaiementsManagement";
import { ClientsSituation } from "@/components/facturation/sections/ClientsSituation";

/**
 * Page de Facturation
 * 
 * Cette page permet de gérer les factures, les paiements et de visualiser la situation des clients.
 * Elle est structurée en trois onglets principaux:
 * 1. Gestion des factures: création, modification, suppression des factures
 * 2. Gestion des paiements: enregistrement et suivi des paiements
 * 3. Situation clients: visualisation des soldes dus par client
 */
const Facturation = () => {
  const [activeTab, setActiveTab] = useState("factures");
  
  // Vérification des permissions
  const { hasPermission, isLoading } = useFacturationPermissions();

  // Si en chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <FacturationHeader onNewFactureClick={() => setActiveTab("factures")} />
      
      <Tabs 
        defaultValue="factures" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="factures">Gestion des factures</TabsTrigger>
          <TabsTrigger value="paiements">Gestion des paiements</TabsTrigger>
          <TabsTrigger value="clients">Situation clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="factures" className="mt-6">
          <FacturesManagement />
        </TabsContent>
        
        <TabsContent value="paiements" className="mt-6">
          <PaiementsManagement />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <ClientsSituation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Facturation;
