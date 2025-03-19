
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import Factures from "@/components/facturation/Factures";
import Paiements from "@/components/facturation/Paiements";
import SituationClients from "@/components/facturation/SituationClients";

const Facturation = () => {
  const [activeTab, setActiveTab] = useState("factures");

  return (
    <PageLayout>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold mb-6">Facturation</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="factures">Factures</TabsTrigger>
            <TabsTrigger value="paiements">Paiements</TabsTrigger>
            <TabsTrigger value="situation">Situation clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="factures">
            <Factures />
          </TabsContent>
          
          <TabsContent value="paiements">
            <Paiements />
          </TabsContent>
          
          <TabsContent value="situation">
            <SituationClients />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Facturation;
