
import Sidebar from "@/components/dashboard/Sidebar";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentTasks from "@/components/dashboard/RecentTasks";
import FiscalAlerts from "@/components/dashboard/FiscalAlerts";
import UpcomingObligations from "@/components/dashboard/UpcomingObligations";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { useFiscalCompliance } from "@/hooks/useFiscalCompliance";

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    
    fetchClientsData();
  }, []);

  // Use the custom hook to handle fiscal compliance
  const { fiscalAlerts, upcomingObligations } = useFiscalCompliance(clients);

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
          <FiscalAlerts fiscalAlerts={fiscalAlerts} />
          <UpcomingObligations obligations={upcomingObligations} />
          <QuickStats />
          <RecentTasks />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
