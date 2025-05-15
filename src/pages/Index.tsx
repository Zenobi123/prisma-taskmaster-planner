
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardAccordion from "@/components/dashboard/DashboardAccordion";
import QuickStats from "@/components/dashboard/QuickStats";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import { UnfiledDsfDialog } from "@/components/dashboard/UnfiledDsfDialog";

const Index = () => {
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // États pour les dialogues
  const [isUnpaidPatenteDialogOpen, setIsUnpaidPatenteDialogOpen] = useState(false);
  const [isUnfiledDsfDialogOpen, setIsUnfiledDsfDialogOpen] = useState(false);
  
  // Mémoisation de la fonction de rafraîchissement pour éviter les re-créations inutiles
  const refreshDashboard = useCallback(() => {
    try {
      // Rafraîchir les requêtes React Query principales
      queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente-summary"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-summary"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf-section"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs-section"] });
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
        <DashboardHeader 
          lastRefresh={lastRefresh} 
          onRefresh={refreshDashboard} 
        />

        <div className="p-8 space-y-8">
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
