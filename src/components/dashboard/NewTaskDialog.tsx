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

  const taskTypes = [
    "Bilan annuel",
    "Déclaration TVA",
    "Révision comptable",
    "Déclaration sociale",
    "Clôture exercice",
    "Situation intermédiaire",
    "Prévisionnel",
    "Audit",
  ];

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
            <Label htmlFor="taskName">Type de tâche</Label>
            <Select name="taskName" required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de tâche" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((task) => (
                  <SelectItem key={task} value={task}>
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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