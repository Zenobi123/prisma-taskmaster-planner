
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import UnpaidPatenteList from "@/components/dashboard/UnpaidPatenteList";
import UnpaidPatenteSummary from "@/components/dashboard/UnpaidPatenteSummary";
import UnpaidPatenteDialog from "@/components/dashboard/UnpaidPatenteDialog";
import ExpiringFiscalAttestations from "@/components/dashboard/ExpiringFiscalAttestations";
import UnfiledDsfList from "@/components/dashboard/UnfiledDsfList";
import UnfiledDsfSummary from "@/components/dashboard/UnfiledDsfSummary";
import UnfiledDsfDialog from "@/components/dashboard/UnfiledDsfDialog";

// Hooks
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();
  
  // États pour les dialogues
  const [isUnpaidPatenteDialogOpen, setIsUnpaidPatenteDialogOpen] = useState(false);
  const [isUnfiledDsfDialogOpen, setIsUnfiledDsfDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // États pour gérer la visibilité des sections
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isAttestationsOpen, setIsAttestationsOpen] = useState(false);
  const [isPatenteOpen, setIsPatenteOpen] = useState(false);
  const [isDsfOpen, setIsDsfOpen] = useState(false);

  // Mémoisation de la fonction de rafraîchissement pour éviter les re-créations inutiles
  const refreshDashboard = useCallback(() => {
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
      
      console.log("Actualisation manuelle du tableau de bord effectuée à", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      toast({
        title: "Erreur d'actualisation",
        description: "Impossible d'actualiser les données. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [queryClient]);

  // Configuration de l'intervalle de rafraîchissement (toutes les 30 secondes)
  useEffect(() => {
    console.log("Mise en place de l'actualisation automatique du tableau de bord");
    
    // Configurer l'intervalle d'actualisation
    const refreshInterval = setInterval(refreshDashboard, 30000); // 30 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(refreshInterval);
      console.log("Nettoyage de l'intervalle d'actualisation");
    };
  }, [refreshDashboard]);

  // Rafraîchir au focus de la fenêtre
  useEffect(() => {
    const handleFocus = () => {
      console.log("Fenêtre a reçu le focus, actualisation des données");
      refreshDashboard();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshDashboard]);

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDashboard}
                className="flex items-center gap-1"
              >
                Actualiser
              </Button>
              <NewTaskDialog />
            </div>
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
