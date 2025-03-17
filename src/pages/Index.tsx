
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import UnpaidPatenteList from "@/components/dashboard/UnpaidPatenteList";
import UnpaidPatenteSummary from "@/components/dashboard/UnpaidPatenteSummary";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import ExpiringFiscalAttestations from "@/components/dashboard/ExpiringFiscalAttestations";
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const queryClient = useQueryClient();
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();
  const [isUnpaidPatenteDialogOpen, setIsUnpaidPatenteDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Configuration de l'intervalle de rafraîchissement (toutes les 60 secondes)
  useEffect(() => {
    console.log("Mise en place de l'actualisation automatique du tableau de bord");
    
    // Fonction pour rafraîchir toutes les données du tableau de bord
    const refreshDashboard = () => {
      try {
        // Rafraîchir les requêtes React Query principales
        queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
        queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente-summary"] });
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
    const refreshInterval = setInterval(refreshDashboard, 60000); // 60 secondes

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
          
          <RecentTasks />
          
          {/* Section Attestations Fiscales maintenant placée AVANT les Patentes */}
          <ExpiringFiscalAttestations 
            attestations={attestations} 
            isLoading={isLoading} 
          />

          {/* Section Patente maintenant placée APRÈS les attestations fiscales */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-800">Gestion des Patentes</h2>
            
            {/* Résumé des patentes impayées */}
            <UnpaidPatenteSummary onViewAllClick={() => setIsUnpaidPatenteDialogOpen(true)} />
            
            {/* Liste des clients avec patente impayée */}
            <UnpaidPatenteList />
          </div>
        </div>
      </main>
      
      <UnpaidPatenteDialog 
        open={isUnpaidPatenteDialogOpen} 
        onOpenChange={setIsUnpaidPatenteDialogOpen} 
      />
      <Toaster />
    </div>
  );
};

export default Index;
