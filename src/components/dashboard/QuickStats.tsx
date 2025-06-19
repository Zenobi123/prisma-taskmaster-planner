
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTasks } from "@/services/taskService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { getClientsStats } from "@/services/clientStatsService";
import { Badge } from "@/components/ui/badge";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import { UnpaidIgsDialog } from "@/components/dashboard/UnpaidIgsDialog";
import { UnfiledDarpDialog } from "@/components/dashboard/UnfiledDarpDialog";
import { getClientsSubjectToObligation } from "@/services/subjectClientsService";

const QuickStats = () => {
  const [showUnpaidPatenteDialog, setShowUnpaidPatenteDialog] = useState(false);
  const [showUnpaidIgsDialog, setShowUnpaidIgsDialog] = useState(false);
  const [showUnfiledDarpDialog, setShowUnfiledDarpDialog] = useState(false);

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  const { data: collaborateurs = [], isLoading: isCollaborateursLoading } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  const { data: clientStats, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientsStats,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  // Get total clients subject to each obligation
  const { data: subjectClients, isLoading: isSubjectClientsLoading } = useQuery({
    queryKey: ["subject-clients"],
    queryFn: getClientsSubjectToObligation,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  // Count tasks that are currently active (en_cours)
  const activeTasks = tasks.filter((task: any) => task.status === "en_cours").length;

  const countCompletedMissions = () => {
    let completedCount = 0;
    const currentMonth = new Date().getMonth();
    
    tasks.forEach((task: any) => {
      if (task.status === "termine" && task.end_date) {
        const endDate = new Date(task.end_date);
        if (endDate.getMonth() === currentMonth) {
          completedCount++;
        }
      }
    });
    
    return completedCount;
  };

  const countActiveCollaborators = () => {
    const collaborateurTaskCount = new Map();
    
    tasks.forEach((task: any) => {
      if (task.status === "en_cours" && task.collaborateur_id) {
        const collaborateurId = task.collaborateur_id;
        const currentCount = collaborateurTaskCount.get(collaborateurId) || 0;
        collaborateurTaskCount.set(collaborateurId, currentCount + 1);
      }
    });
    
    const activeCollaborateurs = collaborateurs.filter(collab => collab.statut === "actif");
    
    return activeCollaborateurs.filter(collab => 
      collaborateurTaskCount.has(collab.id) && collaborateurTaskCount.get(collab.id) > 0
    ).length;
  };

  const completedMissions = countCompletedMissions();
  const activeCollaborators = countActiveCollaborators();

  console.log("QuickStats - Client Stats:", clientStats);
  console.log("QuickStats - Subject Clients:", subjectClients);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card cursor-pointer hover:bg-slate-50 transition-colors"
             onClick={() => setShowUnfiledDarpDialog(true)}>
          <h3 className="font-semibold text-neutral-800 mb-4">
            DARP non déposées
          </h3>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-emerald-600 mr-2">
              {isClientStatsLoading ? (
                <span className="animate-pulse">--</span>
              ) : (
                clientStats?.unfiledDarpClients || 0
              )}
            </div>
            {!isClientStatsLoading && (clientStats?.unfiledDarpClients || 0) > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                À régulariser
              </Badge>
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">
            {isSubjectClientsLoading ? (
              <span className="animate-pulse">-- clients assujettis</span>
            ) : (
              `${subjectClients?.darp || 0} clients assujettis`
            )}
          </p>
        </div>

        <div className="card cursor-pointer hover:bg-slate-50 transition-colors" 
             onClick={() => setShowUnpaidIgsDialog(true)}>
          <h3 className="font-semibold text-neutral-800 mb-4">
            IGS impayés
          </h3>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-emerald-600 mr-2">
              {isClientStatsLoading ? (
                <span className="animate-pulse">--</span>
              ) : (
                clientStats?.unpaidIgsClients || 0
              )}
            </div>
            {!isClientStatsLoading && (clientStats?.unpaidIgsClients || 0) > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                À régulariser
              </Badge>
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">
            {isSubjectClientsLoading ? (
              <span className="animate-pulse">-- clients assujettis</span>
            ) : (
              `${subjectClients?.igs || 0} clients assujettis`
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Clients en gestion
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isClientStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              clientStats?.managedClients || 0
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
              clientStats?.unfiledDsfClients || 0
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">
            {isSubjectClientsLoading ? (
              <span className="animate-pulse">-- clients assujettis</span>
            ) : (
              `${subjectClients?.dsf || 0} clients assujettis`
            )}
          </p>
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
                clientStats?.unpaidPatenteClients || 0
              )}
            </div>
            {!isClientStatsLoading && (clientStats?.unpaidPatenteClients || 0) > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                À régulariser
              </Badge>
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">
            {isSubjectClientsLoading ? (
              <span className="animate-pulse">-- clients assujettis</span>
            ) : (
              `${subjectClients?.patente || 0} clients assujettis`
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Clients inscrits en FANR H2
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isClientStatsLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              clientStats?.fanrH2Clients || 0
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Total</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Missions en cours
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isTasksLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              activeTasks
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Tâches actives</p>
        </div>
      </div>
      
      <UnpaidPatenteDialog 
        open={showUnpaidPatenteDialog} 
        onOpenChange={setShowUnpaidPatenteDialog} 
      />

      <UnpaidIgsDialog
        isOpen={showUnpaidIgsDialog}
        onClose={() => setShowUnpaidIgsDialog(false)}
        clients={[]}
      />

      <UnfiledDarpDialog
        open={showUnfiledDarpDialog}
        onOpenChange={setShowUnfiledDarpDialog}
      />
    </div>
  );
};

export default QuickStats;
