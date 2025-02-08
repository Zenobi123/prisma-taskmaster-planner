
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
            {tasks.map((task: any) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  {task.clients.type === "physique"
                    ? task.clients.nom
                    : task.clients.raisonsociale}
                </td>
                <td>
                  {task.collaborateurs.prenom} {task.collaborateurs.nom}
                </td>
                <td>{getStatusBadge(task.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;
