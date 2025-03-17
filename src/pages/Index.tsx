
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import { Toaster } from "@/components/ui/toaster";
import FiscalAlerts from "@/components/dashboard/FiscalAlerts";
import UpcomingObligations from "@/components/dashboard/UpcomingObligations";
import ExpiringClientDocuments from "@/components/dashboard/ExpiringClientDocuments";
import { useFiscalCompliance } from "@/hooks/useFiscalCompliance";
import { useExpiringClients } from "@/hooks/useExpiringClients";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { fiscalAlerts, upcomingObligations } = useFiscalCompliance();
  const { expiringClients, loading } = useExpiringClients();

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
          <FiscalAlerts alerts={fiscalAlerts} />
          <UpcomingObligations obligations={upcomingObligations} />
          {loading ? (
            <Card className="mb-6 border-orange-300">
              <CardContent className="p-6">
                <div className="text-center py-4 text-neutral-500">
                  Chargement des documents clients...
                </div>
              </CardContent>
            </Card>
          ) : (
            <ExpiringClientDocuments clients={expiringClients} />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
