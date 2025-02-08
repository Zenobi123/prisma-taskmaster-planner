
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { createTask } from "@/services/taskService";

const NewTaskDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const { data: collaborateurs = [] } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Tâche créée",
        description: "La nouvelle tâche a été créée avec succès",
      });
      setIsOpen(false);
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

  const handleNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createTaskMutation.mutate({
      title: formData.get("title") as string,
      client_id: formData.get("client_id") as string,
      collaborateur_id: formData.get("collaborateur_id") as string,
      status: "en_attente",
    });
  };

  // Filtrer les collaborateurs actifs
  const activeCollaborateurs = collaborateurs.filter(
    (collab) => collab.statut === "actif"
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nouvelle tâche</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleNewTask} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre de la tâche</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select name="client_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.type === "physique" ? client.nom : client.raisonsociale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="collaborateur_id">Assigné à</Label>
            <Select name="collaborateur_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un collaborateur" />
              </SelectTrigger>
              <SelectContent>
                {activeCollaborateurs.map((collab) => (
                  <SelectItem key={collab.id} value={collab.id}>
                    {collab.prenom} {collab.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={createTaskMutation.isPending}>
            {createTaskMutation.isPending ? "Création..." : "Créer la tâche"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
