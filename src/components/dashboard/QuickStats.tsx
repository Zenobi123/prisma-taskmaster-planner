
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getClientStats } from "@/services/clientStatsService";
import { Badge } from "@/components/ui/badge";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import { Briefcase, FileText, Clock } from "lucide-react";

const QuickStats = () => {
  const [showUnpaidPatenteDialog, setShowUnpaidPatenteDialog] = useState(false);

  const { data: clientStats = { managedClients: 0, unpaidPatenteClients: 0, unfiledDsfClients: 0 }, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientStats,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Première rangée: les statistiques des clients existantes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Clients en gestion
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isClientStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              clientStats.managedClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Total</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            DSF non déposées
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isClientStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              clientStats.unfiledDsfClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">À régulariser</p>
        </div>

        <div className="card cursor-pointer hover:bg-slate-50 transition-colors" 
             onClick={() => setShowUnpaidPatenteDialog(true)}>
          <h3 className="font-semibold text-neutral-800 mb-4">
            Patentes impayées
          </h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-emerald-600 mr-2">
              {isClientStatsLoading ? (
                <span className="animate-pulse">--</span>
              ) : (
                clientStats.unpaidPatenteClients
              )}
            </div>
            {!isClientStatsLoading && clientStats.unpaidPatenteClients > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                À régulariser
              </Badge>
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Clients assujettis</p>
        </div>
      </div>
      
      {/* Nouvelle rangée: trois sections vides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card opacity-50">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-neutral-500" />
            Section 1
          </h3>
          <div className="text-3xl font-bold text-neutral-400">
            0
          </div>
          <p className="text-neutral-500 text-sm mt-1">Non défini</p>
        </div>

        <div className="card opacity-50">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-neutral-500" />
            Section 2
          </h3>
          <div className="text-3xl font-bold text-neutral-400">
            0
          </div>
          <p className="text-neutral-500 text-sm mt-1">Non défini</p>
        </div>

        <div className="card opacity-50">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-neutral-500" />
            Section 3
          </h3>
          <div className="text-3xl font-bold text-neutral-400">
            0
          </div>
          <p className="text-neutral-500 text-sm mt-1">Non défini</p>
        </div>
      </div>
      
      <UnpaidPatenteDialog 
        open={showUnpaidPatenteDialog} 
        onOpenChange={setShowUnpaidPatenteDialog} 
      />
    </div>
  );
};

export default QuickStats;
