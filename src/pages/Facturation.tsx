
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
import { ExerciceSelector, ExerciceReadOnlyBanner } from "@/components/exercice/ExerciceControls";

const Facturation = () => {
  const [activeTab, setActiveTab] = useState("devis");
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
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-3 sm:mb-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 h-8 px-2 sm:px-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 sm:hidden">
            Facturation
          </h1>
        </div>

        <div className="hidden sm:flex justify-between items-center mb-4 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Facturation</h1>
            <p className="text-neutral-600 mt-1 text-xs sm:text-sm">
              Gestion de la facturation et des paiements
            </p>
          </div>
          <ExerciceSelector />
        </div>

        <div className="sm:hidden mb-3">
          <ExerciceSelector />
        </div>

        <ExerciceReadOnlyBanner className="mb-4" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 overflow-x-auto sticky top-0 bg-background z-10 -mx-2 px-2 sm:mx-0 sm:px-0">
            <TabsList className="bg-transparent h-auto p-0 w-max min-w-full sm:w-full gap-0">
              <TabsTrigger
                value="devis"
                className="px-2.5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <ClipboardList className="h-4 w-4" /> Devis
              </TabsTrigger>
              <TabsTrigger
                value="factures"
                className="px-2.5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <FileText className="h-4 w-4" /> Factures
              </TabsTrigger>
              <TabsTrigger
                value="propositions"
                className="px-2.5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Send className="h-4 w-4" /> <span className="hidden sm:inline">Propositions</span><span className="sm:hidden">Propos.</span>
              </TabsTrigger>
              <TabsTrigger
                value="paiements"
                className="px-2.5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <CreditCard className="h-4 w-4" /> <span className="hidden sm:inline">Paiements</span><span className="sm:hidden">Paiem.</span>
              </TabsTrigger>
              <TabsTrigger
                value="situation"
                className="px-2.5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#84A98C] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#84A98C] data-[state=active]:font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Users className="h-4 w-4" /> <span className="hidden sm:inline">Situation clients</span><span className="sm:hidden">Situa.</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="devis" className="mt-6 animate-fade-in">
            <Devis />
          </TabsContent>

          <TabsContent value="factures" className="mt-6 animate-fade-in">
            <Factures />
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
          
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Facturation;
