
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import Factures from "@/components/facturation/Factures";
import Paiements from "@/components/facturation/Paiements";
import SituationClients from "@/components/facturation/SituationClients";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Facturation = () => {
  const [activeTab, setActiveTab] = useState("factures");
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Facturation</h1>
            <p className="text-neutral-600 mt-1">
              Gestion de la facturation et des paiements
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger 
                value="factures" 
                className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base"
              >
                Factures
              </TabsTrigger>
              <TabsTrigger 
                value="paiements" 
                className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base"
              >
                Paiements
              </TabsTrigger>
              <TabsTrigger 
                value="situation" 
                className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base"
              >
                Situation clients
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="factures" className="mt-6">
            <Factures />
          </TabsContent>
          
          <TabsContent value="paiements" className="mt-6">
            <Paiements />
          </TabsContent>
          
          <TabsContent value="situation" className="mt-6">
            <SituationClients />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Facturation;
