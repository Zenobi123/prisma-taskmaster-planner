
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, determineInitialStatus } from "@/services/taskService";
import { getClients } from "@/services/clientService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { useToast } from "@/components/ui/use-toast";
import { MissionFormFields } from "./MissionFormFields";

interface MissionFormProps {
  onSuccess?: () => void;
}

export const MissionForm = ({ onSuccess }: MissionFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
  });

  const { data: collaborateurs = [] } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  const createMissionMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // La page Missions lit la clé "missions", le tableau de bord et le
      // planning lisent "tasks" ; on rafraîchit les deux + le compteur de tâches.
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
      toast({
        title: "Mission créée",
        description: "La nouvelle mission a été créée avec succès.",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la mission.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = (formData.get("title") as string)?.trim();
    const collaborateurId = formData.get("collaborateur_id") as string;
    const clientId = formData.get("client_id") as string;
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;

    if (!title || !collaborateurId || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Renseignez le titre, le collaborateur et les dates de la mission.",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        variant: "destructive",
        title: "Dates incohérentes",
        description: "La date de fin doit être postérieure ou égale à la date de début.",
      });
      return;
    }

    createMissionMutation.mutate({
      title,
      client_id: clientId || undefined,
      collaborateur_id: collaborateurId,
      status: determineInitialStatus(startDate),
      start_date: startDate,
      end_date: endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <MissionFormFields clients={clients} collaborateurs={collaborateurs} />
      <Button type="submit" disabled={createMissionMutation.isPending}>
        {createMissionMutation.isPending ? "Création..." : "Créer la mission"}
      </Button>
    </form>
  );
};
