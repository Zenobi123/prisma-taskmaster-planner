
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";
import { AlertTriangle, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RecentTasks = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    // Configurer le rafraîchissement automatique
    refetchInterval: 60000,
    refetchOnWindowFocus: true
  });

  // Filter out completed tasks and limit to 10 active tasks
  const activeTasks = tasks
    .filter((task: any) => task.status !== "termine") // Remove all completed tasks
    .slice(0, 10); // Limit to 10 tasks maximum on the dashboard

  const getStatusBadge = (status: string, startDate: string | null, endDate: string | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to start of day for accurate comparison

    // Check if task is overdue
    if (endDate) {
      const taskEndDate = new Date(endDate);
      taskEndDate.setHours(0, 0, 0, 0);

      if (taskEndDate < today && status !== "termine") {
        return (
          <div className="flex items-center gap-1">
            <Badge 
              className="flex items-center gap-1 animate-pulse-slow bg-[#ea384c] hover:bg-[#d32f40] text-white"
            >
              <Flame size={14} className="mr-1" />
              En retard
            </Badge>
          </div>
        );
      }
    }

    // Check if task is planned (status is en_attente but start date is in the future)
    if (status === "en_attente" && startDate) {
      const taskStartDate = new Date(startDate);
      taskStartDate.setHours(0, 0, 0, 0);
      
      if (taskStartDate > today) {
        return <Badge className="bg-purple-500 hover:bg-purple-600">Planifiée</Badge>;
      }
    }

    // If not overdue or planned, show regular status badge
    switch (status) {
      case "en_cours":
        return <Badge variant="success">En cours</Badge>;
      case "termine":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Terminé</Badge>;
      case "en_retard":
        return (
          <Badge className="bg-[#ea384c] hover:bg-[#d32f40] text-white">
            <Flame size={14} className="mr-1" />
            En retard
          </Badge>
        );
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Tâches récentes
        </h2>
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
          <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
          <div className="h-12 bg-neutral-100 rounded-md"></div>
        </div>
      </div>
    );
  }

  console.log("Recent tasks data (excluding completed):", activeTasks);

  return (
    <div className="card mt-8">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">
        Tâches récentes
      </h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tâche</th>
              <th>Client</th>
              <th>Assigné à</th>
              <th>Statut</th>
              <th>Échéance</th>
            </tr>
          </thead>
          <tbody>
            {activeTasks.length > 0 ? (
              activeTasks.map((task: any) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const taskEndDate = task.end_date ? new Date(task.end_date) : null;
                if (taskEndDate) taskEndDate.setHours(0, 0, 0, 0);
                
                const isOverdue =
                  taskEndDate &&
                  taskEndDate < today &&
                  task.status !== "termine";

                // Déterminer si la tâche est planifiée
                const taskStartDate = task.start_date ? new Date(task.start_date) : null;
                let isPlanned = false;
                if (taskStartDate) {
                  taskStartDate.setHours(0, 0, 0, 0);
                  isPlanned = taskStartDate > today && task.status === "en_attente";
                }

                return (
                  <tr 
                    key={task.id} 
                    className={isOverdue 
                      ? "bg-[#fff1f2] border-l-4 border-[#ea384c] text-[#ea384c] hover:bg-[#ffe6e8] transition-colors" 
                      : isPlanned
                        ? "bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100 transition-colors"
                        : "hover:bg-neutral-50 transition-colors"
                    }
                  >
                    <td className="font-medium">{task.title}</td>
                    <td>
                      {task.clients && task.clients.type === "physique"
                        ? task.clients.nom
                        : task.clients?.raisonsociale || "Client inconnu"}
                    </td>
                    <td>
                      {task.collaborateurs ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}` : "Non assigné"}
                    </td>
                    <td>{getStatusBadge(task.status, task.start_date, task.end_date)}</td>
                    <td className="flex items-center gap-1">
                      {task.end_date ? (
                        <>
                          <Clock 
                            size={14} 
                            className={isOverdue ? "text-[#ea384c] animate-pulse-slow" : ""} 
                          />
                          {new Date(task.end_date).toLocaleDateString()}
                        </>
                      ) : (
                        "Non définie"
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Aucune tâche active n'a été trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;
