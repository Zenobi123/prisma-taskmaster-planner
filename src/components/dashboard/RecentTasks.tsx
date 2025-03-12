
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";
import { AlertTriangle, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RecentTasks = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Filter out completed tasks
  const activeTasks = tasks.filter((task: any) => task.status !== "termine");

  const getStatusBadge = (status: string, endDate: string | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to start of day for accurate comparison

    // Check if task is overdue
    if (endDate) {
      const taskEndDate = new Date(endDate);
      taskEndDate.setHours(0, 0, 0, 0);

      if (taskEndDate < today && status !== "termine") {
        return (
          <div className="flex items-center gap-1">
            <Badge variant="destructive" className="flex items-center gap-1 animate-pulse-slow">
              <Flame size={14} className="mr-1" />
              En retard
            </Badge>
          </div>
        );
      }
    }

    // If not overdue, show regular status badge
    switch (status) {
      case "en_cours":
        return <Badge variant="success">En cours</Badge>;
      case "termine":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Terminé</Badge>;
      case "planifiee":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Planifiée</Badge>;
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

  console.log("Recent tasks data:", tasks);

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

                return (
                  <tr 
                    key={task.id} 
                    className={isOverdue 
                      ? "bg-red-50 border-l-4 border-destructive text-destructive hover:bg-red-100 transition-colors" 
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
                    <td>{getStatusBadge(task.status, task.end_date)}</td>
                    <td className="flex items-center gap-1">
                      {task.end_date ? (
                        <>
                          <Clock 
                            size={14} 
                            className={isOverdue ? "text-destructive animate-pulse-slow" : ""} 
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
