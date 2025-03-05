
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";
import { Badge } from "@/components/ui/badge";

const QuickStats = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Calculate statistics based on actual data
  const activeTasks = tasks.filter((task: any) => task.status === "en_cours").length;
  
  // Sum of task durations (in days) for current month
  const calculateWorkHours = () => {
    let totalHours = 0;
    const currentMonth = new Date().getMonth();
    
    tasks.forEach((task: any) => {
      if (task.start_date && task.end_date) {
        const startDate = new Date(task.start_date);
        // Only count tasks that started in the current month
        if (startDate.getMonth() === currentMonth) {
          const endDate = new Date(task.end_date);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // Estimate 8 working hours per day
          totalHours += diffDays * 8;
        }
      }
    });
    
    return totalHours;
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

  const workHours = calculateWorkHours();
  const activeCollaborators = countActiveCollaborators();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="font-semibold text-neutral-800 mb-4">
          Tâches en cours
        </h3>
        <div className="text-3xl font-bold text-primary">
          {isLoading ? (
            <span className="animate-pulse">--</span>
          ) : (
            activeTasks
          )}
        </div>
        <p className="text-neutral-600 text-sm mt-1">Cette semaine</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-neutral-800 mb-4">
          Heures travaillées
        </h3>
        <div className="text-3xl font-bold text-primary">
          {isLoading ? (
            <span className="animate-pulse">--</span>
          ) : (
            workHours
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
            {isLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              activeCollaborators
            )}
          </div>
          {!isLoading && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Actifs
            </Badge>
          )}
        </div>
        <p className="text-neutral-600 text-sm mt-1">Sur les missions</p>
      </div>
    </div>
  );
};

export default QuickStats;
