
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";
import { getClientStats } from "@/services/clientStatsService";
import { Badge } from "@/components/ui/badge";

const QuickStats = () => {
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: clientStats = { managedClients: 0, unpaidPatenteClients: 0, unfiledDsfClients: 0 }, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientStats,
  });

  // Calculate statistics based on actual data
  const activeTasks = tasks.filter((task: any) => task.status === "en_cours").length;
  
  // Count completed missions for current month
  const countCompletedMissions = () => {
    let completedCount = 0;
    const currentMonth = new Date().getMonth();
    
    tasks.forEach((task: any) => {
      if (task.status === "termine" && task.end_date) {
        const endDate = new Date(task.end_date);
        // Only count tasks that were completed in the current month
        if (endDate.getMonth() === currentMonth) {
          completedCount++;
        }
      }
    });
    
    return completedCount;
  };
  
  // Count unique collaborators assigned to tasks
  const countActiveCollaborators = () => {
    const collaborateurIds = new Set();
    tasks.forEach((task: any) => {
      if (task.collaborateur_id) {
        collaborateurIds.add(task.collaborateur_id);
      }
    });
    return collaborateurIds.size;
  };

  const completedMissions = countCompletedMissions();
  const activeCollaborators = countActiveCollaborators();

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Première rangée: les 3 premières caractéristiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Tâches en cours
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isTasksLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              activeTasks
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Cette semaine</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Missions réalisées
          </h3>
          <div className="text-3xl font-bold text-primary">
            {isTasksLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              completedMissions
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Ce mois</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Collaborateurs actifs
          </h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-primary mr-2">
              {isTasksLoading ? (
                <span className="animate-pulse">--</span>
              ) : (
                activeCollaborators
              )}
            </div>
            {!isTasksLoading && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Actifs
              </Badge>
            )}
          </div>
          <p className="text-neutral-600 text-sm mt-1">Sur les missions</p>
        </div>
      </div>

      {/* Deuxième rangée: les statistiques des clients */}
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

        <div className="card">
          <h3 className="font-semibold text-neutral-800 mb-4">
            Patentes impayées
          </h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-primary mr-2">
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
    </div>
  );
};

export default QuickStats;
