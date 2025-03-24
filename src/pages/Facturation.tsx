
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import Factures from "@/components/facturation/Factures";
import Paiements from "@/components/facturation/Paiements";
import SituationClients from "@/components/facturation/SituationClients";
import AnalyseFacturesPaiements from "@/components/facturation/analyse/AnalyseFacturesPaiements";
import { ArrowLeft, FileText, CreditCard, Users, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Facturation = () => {
  const [activeTab, setActiveTab] = useState("factures");
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Facturation</h1>
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
                className="px-8 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-base transition-all flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> Factures
              </TabsTrigger>
              <TabsTrigger 
                value="paiements" 
                className="px-8 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-base transition-all flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" /> Paiements
              </TabsTrigger>
              <TabsTrigger 
                value="situation" 
                className="px-8 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-base transition-all flex items-center gap-2"
              >
                <Users className="h-4 w-4" /> Situation clients
              </TabsTrigger>
              <TabsTrigger 
                value="analyse" 
                className="px-8 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-base transition-all flex items-center gap-2"
              >
                <BarChart className="h-4 w-4" /> Analyse
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="factures" className="mt-6 animate-fade-in">
            <Factures />
          </TabsContent>
          
          <TabsContent value="paiements" className="mt-6 animate-fade-in">
            <Paiements />
          </TabsContent>
          
          <TabsContent value="situation" className="mt-6 animate-fade-in">
            <SituationClients />
          </TabsContent>
          
          <TabsContent value="analyse" className="mt-6 animate-fade-in">
            <AnalyseFacturesPaiements />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Facturation;
