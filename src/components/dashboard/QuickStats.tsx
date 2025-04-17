import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getClientStats } from "@/services/clientStatsService";
import { Badge } from "@/components/ui/badge";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import { Briefcase, FileText, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { getClientsRegimeStats } from "@/services/clientRegimeService";

const QuickStats = () => {
  const [showUnpaidPatenteDialog, setShowUnpaidPatenteDialog] = useState(false);

  const { data: clientStats = { managedClients: 0, unpaidPatenteClients: 0, unfiledDsfClients: 0 }, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientStats,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  const { data: regimeStats = { reelClients: 0, igsClients: 0, delayedIgsClients: 0 }, isLoading: isRegimeStatsLoading } = useQuery({
    queryKey: ["regime-stats"],
    queryFn: getClientsRegimeStats,
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
      
      {/* Deuxième rangée: statistiques des régimes fiscaux et IGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-indigo-500" />
            Clients au réel
          </h3>
          <div className="text-3xl font-bold text-indigo-600">
            {isRegimeStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              regimeStats.reelClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Régime du réel</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-500" />
            Clients à IGS
          </h3>
          <div className="text-3xl font-bold text-blue-600">
            {isRegimeStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              regimeStats.igsClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Impôt Global Simplifié</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            IGS en retard
          </h3>
          <div className="text-3xl font-bold text-amber-600">
            {isRegimeStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              regimeStats.delayedIgsClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Paiement en retard</p>
        </div>
      </div>
      
      {/* Troisième rangée: Nouveaux stats IGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Clients au réel
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isRegimeStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              regimeStats.reelClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Régime fiscal classique</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Clients à IGS
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isRegimeStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              regimeStats.igsClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Impôt Général Synthétique</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            IGS en retard
          </h3>
          <div className="text-3xl font-bold text-amber-600">
            {isRegimeStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              regimeStats.delayedIgsClients
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Paiement en retard</p>
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
