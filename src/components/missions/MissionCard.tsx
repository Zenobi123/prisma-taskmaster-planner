
import { Button } from "@/components/ui/button";
import { Briefcase, Check, Clock, PlayCircle, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateTaskStatus, deleteTask } from "@/services/taskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    client: string;
    assignedTo: string;
    status: string;
    startDate: string;
    endDate: string;
    clientId: string;
    collaborateurId: string;
  };
}

const MissionCard = ({ mission }: MissionCardProps) => {
  const queryClient = useQueryClient();
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "en_attente" | "en_cours" | "termine" | "en_retard" }) => 
      updateTaskStatus(id, status),
    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du statut: " + error.message);
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      toast.success("Tâche supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_cours":
        return <Badge variant="secondary">En cours</Badge>;
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>;
      case "planifiee":
        return <Badge variant="default" className="bg-blue-500">Planifiée</Badge>;
      case "termine":
        return <Badge variant="success">Terminée</Badge>;
      default:
        return null;
    }
  };

  // Nous utilisons "en_attente" au lieu de "planifiee" pour être compatible avec taskService
  const handleStatusChange = (newStatus: "en_attente" | "en_cours" | "termine" | "en_retard") => {
    updateStatusMutation.mutate({ id: mission.id, status: newStatus });
  };

  const handleDelete = () => {
    deleteTaskMutation.mutate(mission.id);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{mission.title}</h3>
          <p className="text-gray-600">{mission.client}</p>
          <p className="text-sm text-gray-500">Assigné à: {mission.assignedTo}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-sm text-gray-500">
              Du {mission.startDate} au {mission.endDate}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(mission.status)}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Changer le statut
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Nous remplaçons "planifiee" par "en_attente" dans l'interface utilisateur également,
                    mais gardons le texte affiché comme "Planifiée" */}
                <DropdownMenuItem 
                  onClick={() => handleStatusChange("en_attente")}
                  className="flex items-center gap-2"
                  disabled={mission.status === "planifiee" || mission.status === "en_attente"}
                >
                  <Calendar className="h-4 w-4" /> Planifiée
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange("en_attente")}
                  className="flex items-center gap-2"
                  disabled={mission.status === "en_attente"}
                >
                  <Clock className="h-4 w-4" /> En attente
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange("en_cours")}
                  className="flex items-center gap-2"
                  disabled={mission.status === "en_cours"}
                >
                  <PlayCircle className="h-4 w-4" /> En cours
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange("termine")}
                  className="flex items-center gap-2"
                  disabled={mission.status === "termine"}
                >
                  <Check className="h-4 w-4" /> Terminée
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement cette tâche.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
