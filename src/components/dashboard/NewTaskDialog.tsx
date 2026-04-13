
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { TaskForm } from "../tasks/TaskForm";

const NewTaskDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
  });

  const { data: collaborateurs = [] } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nouvelle tâche</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Créer une nouvelle tâche
          </DialogTitle>
          <DialogDescription>
            Assignez une tâche à un collaborateur et associez-la à un client.
          </DialogDescription>
        </DialogHeader>
        <TaskForm 
          clients={clients} 
          collaborateurs={collaborateurs} 
          onSuccess={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
