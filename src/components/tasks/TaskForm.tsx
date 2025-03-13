
import { Button } from "@/components/ui/button";
import { TaskFormFields } from "./TaskFormFields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, determineInitialStatus } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";
import { createErrorHandler } from "@/utils/errorHandling";
import { useState } from "react";

interface TaskFormProps {
  clients: any[];
  collaborateurs: any[];
  onSuccess: () => void;
}

export const TaskForm = ({ clients, collaborateurs, onSuccess }: TaskFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Tâche créée",
        description: "La nouvelle tâche a été créée avec succès",
      });
      onSuccess();
      setFormError(null);
    },
    onError: createErrorHandler("Une erreur est survenue lors de la création de la tâche.", "TaskForm")
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const client_id = formData.get("client_id") as string;
    const collaborateur_id = formData.get("collaborateur_id") as string;
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;

    // Basic form validation
    if (!title?.trim()) {
      setFormError("Le titre de la tâche est requis");
      return;
    }

    if (!client_id) {
      setFormError("Veuillez sélectionner un client");
      return;
    }

    if (!collaborateur_id) {
      setFormError("Veuillez sélectionner un collaborateur");
      return;
    }
    
    createTaskMutation.mutate({
      title,
      client_id,
      collaborateur_id,
      status: determineInitialStatus(startDate),
      start_date: startDate,
      end_date: endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
          {formError}
        </div>
      )}
      
      <TaskFormFields clients={clients} collaborateurs={collaborateurs} />
      
      <Button type="submit" disabled={createTaskMutation.isPending}>
        {createTaskMutation.isPending ? "Création..." : "Créer la tâche"}
      </Button>
    </form>
  );
};
