
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";

const RecentTasks = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_cours":
        return <span className="badge badge-green">En cours</span>;
      case "termine":
        return <span className="badge badge-blue">Terminé</span>;
      case "planifiee":
        return <span className="badge badge-purple">Planifiée</span>;
      default:
        return <span className="badge badge-gray">En attente</span>;
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
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    {task.clients && task.clients.type === "physique"
                      ? task.clients.nom
                      : task.clients?.raisonsociale || "Client inconnu"}
                  </td>
                  <td>
                    {task.collaborateurs ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}` : "Non assigné"}
                  </td>
                  <td>{getStatusBadge(task.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Aucune tâche n'a été créée.
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
