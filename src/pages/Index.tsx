
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardAccordion from "@/components/dashboard/DashboardAccordion";
import QuickStats from "@/components/dashboard/QuickStats";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import { UnfiledDsfDialog } from "@/components/dashboard/UnfiledDsfDialog";
import { useAuthorization } from "@/hooks/useAuthorization";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";

const Index = () => {
  const { isAuthorized } = useAuthorization(
    ["admin", "comptable", "gestionnaire", "expert-comptable", "fiscaliste", "assistant"],
    "dashboard",
    { showToast: true }
  );
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // États pour les dialogues - tous fermés par défaut
  const [isUnpaidPatenteDialogOpen, setIsUnpaidPatenteDialogOpen] = useState(false);
  const [isUnfiledDsfDialogOpen, setIsUnfiledDsfDialogOpen] = useState(false);
  
  // Mémoisation de la fonction de rafraîchissement pour éviter les re-créations inutiles
  const refreshDashboard = useCallback(() => {
    try {
      // Rafraîchir les requêtes React Query principales avec les nouvelles clés
      queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente-summary"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-summary"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-section"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-dialog"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs-section"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      
      // Mettre à jour le timestamp de dernière actualisation
      setLastRefresh(new Date());
      
      
      // Supprimer complètement l'affichage des toasts pour éviter le popup
    } catch (error) {
      // Supprimer également l'affichage du toast d'erreur
    }
  }, [queryClient]);

  // Rafraîchissement périodique (toutes les 2 minutes) — les changements temps réel
  // sont déjà gérés par useAutoUpdate, on espace donc l'intervalle.
  // Pas de refresh au focus : React Query est configuré avec refetchOnWindowFocus=false.
  useEffect(() => {
    const refreshInterval = setInterval(refreshDashboard, 120000);
    return () => clearInterval(refreshInterval);
  }, [refreshDashboard]);


  // Invalidation manuelle des caches
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__invalidateFiscalCaches) {
      window.__invalidateFiscalCaches();
    }
  }, []);


  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="dashboard" />;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-neutral-100">
        <DashboardHeader 
          lastRefresh={lastRefresh} 
          onRefresh={refreshDashboard} 
        />

        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
          <QuickStats />
          <DashboardAccordion />
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
