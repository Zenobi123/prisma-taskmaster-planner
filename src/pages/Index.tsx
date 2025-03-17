
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import UnpaidPatenteList from "@/components/dashboard/UnpaidPatenteList";
import UnpaidPatenteSummary from "@/components/dashboard/UnpaidPatenteSummary";
import UnpaidPatenteDialog from "@/components/dashboard/UnpaidPatenteDialog";
import ExpiringFiscalAttestations from "@/components/dashboard/ExpiringFiscalAttestations";
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const Index = () => {
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();
  const [isUnpaidPatenteDialogOpen, setIsUnpaidPatenteDialogOpen] = useState(false);

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
              </p>
            </div>
            <NewTaskDialog />
          </div>
        </header>

        <div className="p-8">
          <QuickStats />
          <UnpaidPatenteSummary onViewAllClick={() => setIsUnpaidPatenteDialogOpen(true)} />
          <RecentTasks />
          <UnpaidPatenteList />
          <ExpiringFiscalAttestations 
            attestations={attestations} 
            isLoading={isLoading} 
          />
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
