
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import UnpaidPatenteList from "@/components/dashboard/UnpaidPatenteList";
import UnpaidPatenteSummary from "@/components/dashboard/UnpaidPatenteSummary";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import ExpiringFiscalAttestations from "@/components/dashboard/ExpiringFiscalAttestations";
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";
import UnfiledDsfList from "@/components/dashboard/UnfiledDsfList";
import UnfiledDsfSummary from "@/components/dashboard/UnfiledDsfSummary";
import { UnfiledDsfDialog } from "@/components/dashboard/UnfiledDsfDialog";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();
  const [isUnpaidPatenteDialogOpen, setIsUnpaidPatenteDialogOpen] = useState(false);
  const [isUnfiledDsfDialogOpen, setIsUnfiledDsfDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // États pour gérer la visibilité de chaque section
  const [isTasksOpen, setIsTasksOpen] = useState(true);
  const [isAttestationsOpen, setIsAttestationsOpen] = useState(true);
  const [isPatenteOpen, setIsPatenteOpen] = useState(true);
  const [isDsfOpen, setIsDsfOpen] = useState(true);

  // Configuration de l'intervalle de rafraîchissement (toutes les 10 secondes)
  useEffect(() => {
    console.log("Mise en place de l'actualisation automatique du tableau de bord");
    
    // Fonction pour rafraîchir toutes les données du tableau de bord
    const refreshDashboard = () => {
      try {
        // Rafraîchir les requêtes React Query principales
        queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente-summary"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-summary"] });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["client-stats"] });
        
        // Mettre à jour le timestamp de dernière actualisation
        setLastRefresh(new Date());
        
        console.log("Actualisation automatique du tableau de bord effectuée à", new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Erreur lors de l'actualisation automatique:", error);
      }
    };

    // Configurer l'intervalle d'actualisation
    const refreshInterval = setInterval(refreshDashboard, 10000); // 10 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(refreshInterval);
      console.log("Nettoyage de l'intervalle d'actualisation");
    };
  }, [queryClient]);

  console.log("Index - Rendering dashboard components, last refresh:", lastRefresh.toLocaleTimeString());

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-neutral-100">
        <header className="bg-white border-b border-neutral-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-800">
                Tableau de bord
              </h1>
              <p className="text-neutral-600 mt-1">
                Bienvenue sur votre espace de gestion
                <span className="text-xs ml-2 text-neutral-400">
                  Actualisé à {lastRefresh.toLocaleTimeString()}
                </span>
              </p>
            </div>
            <NewTaskDialog />
          </div>
        </header>

        <div className="p-8 space-y-8">
          <QuickStats />
          
          {/* Section Tâches Récentes */}
          <Collapsible open={isTasksOpen} onOpenChange={setIsTasksOpen} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h2 className="text-xl font-semibold text-neutral-800">
                Tâches récentes
              </h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isTasksOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="p-2">
                <RecentTasks />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Section Attestations Fiscales */}
          <Collapsible open={isAttestationsOpen} onOpenChange={setIsAttestationsOpen} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h2 className="text-xl font-semibold text-neutral-800">
                Attestations de Conformité Fiscale
              </h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isAttestationsOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="p-2">
                <ExpiringFiscalAttestations 
                  attestations={attestations} 
                  isLoading={isLoading} 
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section Patente */}
          <Collapsible open={isPatenteOpen} onOpenChange={setIsPatenteOpen} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h2 className="text-xl font-semibold text-neutral-800">
                Gestion des Patentes
              </h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isPatenteOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="p-4 space-y-6">
                {/* Résumé des patentes impayées */}
                <UnpaidPatenteSummary onViewAllClick={() => setIsUnpaidPatenteDialogOpen(true)} />
                
                {/* Liste des clients avec patente impayée */}
                <UnpaidPatenteList />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Section DSF */}
          <Collapsible open={isDsfOpen} onOpenChange={setIsDsfOpen} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h2 className="text-xl font-semibold text-neutral-800">
                Déclarations Statistiques et Fiscales
              </h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isDsfOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="p-4 space-y-6">
                {/* Résumé des DSF non déposées */}
                <UnfiledDsfSummary onViewAllClick={() => setIsUnfiledDsfDialogOpen(true)} />
                
                {/* Liste des clients avec DSF non déposée */}
                <UnfiledDsfList />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
      
      <UnpaidPatenteDialog 
        open={isUnpaidPatenteDialogOpen} 
        onOpenChange={setIsUnpaidPatenteDialogOpen} 
      />
      
      <UnfiledDsfDialog 
        open={isUnfiledDsfDialogOpen} 
        onOpenChange={setIsUnfiledDsfDialogOpen} 
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
