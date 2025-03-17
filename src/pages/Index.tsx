
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import UnpaidPatenteList from "@/components/dashboard/UnpaidPatenteList";
import ExpiringFiscalAttestations from "@/components/dashboard/ExpiringFiscalAttestations";
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Index = () => {
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();

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
          <RecentTasks />
          <UnpaidPatenteList />
          <ExpiringFiscalAttestations 
            attestations={attestations} 
            isLoading={isLoading} 
          />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
