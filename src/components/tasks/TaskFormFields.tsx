
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
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";

interface TaskFormFieldsProps {
  clients: any[];
  collaborateurs: any[];
}

export const TaskFormFields = ({ clients, collaborateurs }: TaskFormFieldsProps) => {
  // Filtrer les collaborateurs actifs
  const activeCollaborateurs = collaborateurs.filter(
    (collab) => collab.statut === "actif"
  );
  
  const startDateButtonRef = useRef<HTMLButtonElement>(null);
  const endDateButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setTimeout(() => {
        if (startDateButtonRef.current) {
          startDateButtonRef.current.click();
        }
      }, 100);
    }
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setTimeout(() => {
        if (endDateButtonRef.current) {
          endDateButtonRef.current.click();
        }
      }, 100);
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="title">Titre de la tâche</Label>
        <Input id="title" name="title" required placeholder="Entrez le titre de la tâche" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="client_id">Client (optionnel)</Label>
        <Select name="client_id">
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionnez un client (optionnel)" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="h-[200px] w-full">
              {clients.map((client) => (
                <SelectItem 
                  key={client.id} 
                  value={client.id}
                  className="cursor-pointer hover:bg-neutral-100"
                >
                  {client.type === "physique" 
                    ? `${client.nom} (Particulier)` 
                    : `${client.raisonsociale} (Entreprise)`
                  }
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="collaborateur_id">Assigné à</Label>
        <Select name="collaborateur_id" required>
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionnez un collaborateur" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="h-[200px] w-full">
              {activeCollaborateurs.map((collab) => (
                <SelectItem 
                  key={collab.id} 
                  value={collab.id}
                  className="cursor-pointer hover:bg-neutral-100"
                >
                  {collab.prenom} {collab.nom}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={startDateButtonRef}
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-background border-input",
                  !Input && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Sélectionner une date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-lg border">
              <Calendar
                mode="single"
                required
                locale={fr}
                initialFocus
                onSelect={handleStartDateSelect}
                className="pointer-events-auto scale-90 origin-top"
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
        <div className="space-y-1.5">
          <Label htmlFor="end_date">Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={endDateButtonRef}
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-background border-input",
                  !Input && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Sélectionner une date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-lg border">
              <Calendar
                mode="single"
                required
                locale={fr}
                initialFocus
                onSelect={handleEndDateSelect}
                className="pointer-events-auto scale-90 origin-top"
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
      
      {/* Ajout des champs pour la planche horaire */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_time" className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Heure de début
          </Label>
          <Input
            type="time"
            id="start_time"
            name="start_time"
            className="bg-background border-input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_time" className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Heure de fin
          </Label>
          <Input
            type="time"
            id="end_time"
            name="end_time"
            className="bg-background border-input"
          />
        </div>
      </div>
    </>
  );
};
