
import { Button } from "@/components/ui/button";
import { TaskFormFields } from "./TaskFormFields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/services/taskService";
import { useToast } from "@/components/ui/use-toast";

interface TaskFormProps {
  clients: any[];
  collaborateurs: any[];
  onSuccess: () => void;
}

export const TaskForm = ({ clients, collaborateurs, onSuccess }: TaskFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Tâche créée",
        description: "La nouvelle tâche a été créée avec succès",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la tâche:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tâche.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createTaskMutation.mutate({
      title: formData.get("title") as string,
      client_id: formData.get("client_id") as string,
      collaborateur_id: formData.get("collaborateur_id") as string,
      status: "en_attente",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TaskFormFields clients={clients} collaborateurs={collaborateurs} />
      <Button type="submit" disabled={createTaskMutation.isPending}>
        {createTaskMutation.isPending ? "Création..." : "Créer la tâche"}
      </Button>
    </form>
  );
};
