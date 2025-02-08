
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "@/services/taskService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RecentTasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(taskId, status as "en_attente" | "en_cours" | "termine"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tâche a été mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
      });
    },
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_cours":
        return "En cours";
      case "termine":
        return "Terminé";
      default:
        return "En attente";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "en_cours":
        return "badge badge-green";
      case "termine":
        return "badge badge-blue";
      default:
        return "badge badge-gray";
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
                <td>
                  <Select
                    defaultValue={task.status}
                    onValueChange={(value) =>
                      updateStatusMutation.mutate({
                        taskId: task.id,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger className={getStatusBadgeClass(task.status)}>
                      <SelectValue>{getStatusLabel(task.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="termine">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;
