
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
      <div className="py-4 px-6">
        <div className="flex items-center gap-4 mb-6">
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
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-2xl">
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
