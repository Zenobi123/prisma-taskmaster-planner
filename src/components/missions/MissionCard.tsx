import { Button } from "@/components/ui/button";
import { Check, Clock, PlayCircle, Trash, Calendar } from "lucide-react";
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
import { OrdreMissionDialog } from "./OrdreMissionDialog";
import { RapportMissionUpload } from "./RapportMissionUpload";
import type { MissionInfo } from "@/services/missionDocumentService";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    client: string;
    assignedTo: string;
    status: string;
    startDate: string;
    endDate: string;
    rawStartDate: string | null;
    rawEndDate: string | null;
    clientId: string;
    collaborateurId: string;
  };
}

const MissionCard = ({ mission }: MissionCardProps) => {
  const queryClient = useQueryClient();

  const missionInfo: MissionInfo = {
    id: mission.id,
    title: mission.title,
    start_date: mission.rawStartDate,
    end_date: mission.rawEndDate,
    collaborateur_id: mission.collaborateurId,
    client_id: mission.clientId,
  };

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
    },
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
    },
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
      case "en_retard":
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: "en_attente" | "en_cours" | "termine" | "en_retard") => {
    updateStatusMutation.mutate({ id: mission.id, status: newStatus });
  };

  const handleDelete = () => {
    deleteTaskMutation.mutate(mission.id);
  };

  return (
    <div className="p-3 sm:p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base sm:text-lg truncate">{mission.title}</h3>
          <p className="text-gray-600 text-sm truncate">{mission.client}</p>
          <p className="text-xs sm:text-sm text-gray-500 truncate">Assigné à : {mission.assignedTo}</p>
          <div className="flex gap-2 mt-1.5">
            <span className="text-xs sm:text-sm text-gray-500">
              Du {mission.startDate} au {mission.endDate}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {getStatusBadge(mission.status)}

          {/* Actions principales */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {/* Ordre de mission */}
            <OrdreMissionDialog mission={missionInfo} missionTitle={mission.title} />

            {/* Rapport de mission */}
            <RapportMissionUpload mission={missionInfo} missionTitle={mission.title} />

            {/* Changer le statut */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3">
                  <span className="hidden sm:inline">Statut</span>
                  <span className="sm:hidden">…</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("en_attente")}
                  className="flex items-center gap-2"
                  disabled={mission.status === "en_attente"}
                >
                  <Calendar className="h-4 w-4" /> En attente
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

            {/* Supprimer */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 px-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la mission ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. La mission et ses documents associés seront supprimés.
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
