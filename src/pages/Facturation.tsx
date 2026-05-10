
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import Factures from "@/components/facturation/Factures";
import Devis from "@/components/facturation/Devis";
import Propositions from "@/components/facturation/Propositions";
import Paiements from "@/components/facturation/Paiements";
import SituationClients from "@/components/facturation/SituationClients";
import { ArrowLeft, FileText, ClipboardList, Send, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthorization } from "@/hooks/useAuthorization";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";

const Facturation = () => {
  const [activeTab, setActiveTab] = useState("factures");
  const navigate = useNavigate();
  
  // Vérifier les autorisations d'accès
  const { isAuthorized } = useAuthorization(
    ["admin"], 
    "facturation",
    { showToast: true }
  );

  // Si l'utilisateur n'est pas administrateur, afficher le message d'erreur
  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="facturation" />;
  }

  return (
    <PageLayout>
      <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Facturation</h1>
            <p className="text-neutral-600 mt-1 text-xs sm:text-sm hidden sm:block">
              Gestion de la facturation et des paiements
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 overflow-x-auto">
            <TabsList className="bg-transparent h-auto p-0 w-max min-w-full sm:w-full">
              <TabsTrigger
                value="factures"
                className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Factures
              </TabsTrigger>
              <TabsTrigger
                value="devis"
                className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Devis
              </TabsTrigger>
              <TabsTrigger
                value="propositions"
                className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Propositions</span><span className="sm:hidden">Propos.</span>
              </TabsTrigger>
              <TabsTrigger
                value="paiements"
                className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Paiements</span><span className="sm:hidden">Paiem.</span>
              </TabsTrigger>
              <TabsTrigger
                value="situation"
                className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Situation clients</span><span className="sm:hidden">Situation</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="factures" className="mt-6 animate-fade-in">
            <Factures />
          </TabsContent>

          <TabsContent value="devis" className="mt-6 animate-fade-in">
            <Devis />
          </TabsContent>

          <TabsContent value="propositions" className="mt-6 animate-fade-in">
            <Propositions />
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

          <TabsContent value="activite" className="mt-6 animate-fade-in">
            <VueActivite />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Facturation;
