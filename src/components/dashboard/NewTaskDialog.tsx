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

const NewTaskDialog = () => {
  const { toast } = useToast();

  const handleNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Tâche créée",
      description: "La nouvelle tâche a été créée avec succès",
    });
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nouvelle tâche</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleNewTask} className="space-y-4">
          <div>
            <Label htmlFor="taskName">Nom de la tâche</Label>
            <Input id="taskName" required />
          </div>
          <div>
            <Label htmlFor="client">Client</Label>
            <Input id="client" required />
          </div>
          <div>
            <Label htmlFor="assignedTo">Assigné à</Label>
            <Input id="assignedTo" required />
          </div>
          <Button type="submit">Créer la tâche</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;