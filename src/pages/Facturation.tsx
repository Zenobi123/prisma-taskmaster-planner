
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import Factures from "@/components/facturation/Factures";
import Paiements from "@/components/facturation/Paiements";
import SituationClients from "@/components/facturation/SituationClients";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Facturation = () => {
  const [activeTab, setActiveTab] = useState("factures");
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-semibold">Facturation</h1>
          </div>
          <p className="text-muted-foreground">
            Gérez vos factures, suivez les paiements, et consultez la situation financière de vos clients. Ce module vous permet de maintenir une vue complète sur votre facturation et d'assurer le suivi des règlements.
          </p>
        </div>
        
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
