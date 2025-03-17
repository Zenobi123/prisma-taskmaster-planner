
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Toaster } from "@/components/ui/toaster";
import FiscalAlerts from "@/components/dashboard/FiscalAlerts";
import UpcomingObligations from "@/components/dashboard/UpcomingObligations";
import { useFiscalCompliance } from "@/hooks/useFiscalCompliance";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { fiscalAlerts, upcomingObligations, isLoading, error } = useFiscalCompliance();

  console.log("Index rendering with alerts:", fiscalAlerts);
  
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
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <FiscalAlerts alerts={fiscalAlerts || []} />
              <UpcomingObligations obligations={upcomingObligations || []} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  Erreur lors du chargement des données fiscales: {error.message}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
