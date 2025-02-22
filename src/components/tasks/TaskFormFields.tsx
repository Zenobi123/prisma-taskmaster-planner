
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskFormFieldsProps {
  clients: any[];
  collaborateurs: any[];
}

export const TaskFormFields = ({ clients, collaborateurs }: TaskFormFieldsProps) => {
  // Filtrer les collaborateurs actifs
  const activeCollaborateurs = collaborateurs.filter(
    (collab) => collab.statut === "actif"
  );

  return (
    <>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !Input && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Sélectionner une date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                required
                locale={fr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input 
            type="date" 
            id="start_date" 
            name="start_date" 
            required 
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="end_date">Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !Input && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Sélectionner une date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                required
                locale={fr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input 
            type="date" 
            id="end_date" 
            name="end_date" 
            required 
            className="mt-2"
          />
        </div>
      </div>
    </>
  );
};
