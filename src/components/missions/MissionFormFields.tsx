import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MissionFormFieldsProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const MissionFormFields = ({
  selectedDate,
  onDateChange,
}: MissionFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titre de la mission</Label>
        <Input id="title" name="title" placeholder="Titre de la mission" required />
      </div>

      <div>
        <Label>Client</Label>
        <Select name="client_id" required>
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionnez un client" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="h-[200px] w-full">
              <SelectItem value="client1">SARL TechPro</SelectItem>
              <SelectItem value="client2">SAS WebDev</SelectItem>
              <SelectItem value="client3">EURL ConseilPlus</SelectItem>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Assigné à</Label>
        <Select name="collaborateur_id" required>
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionnez un collaborateur" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="h-[200px] w-full">
              <SelectItem value="collab1">Sophie Martin</SelectItem>
              <SelectItem value="collab2">Pierre Dubois</SelectItem>
              <SelectItem value="collab3">Marie Lambert</SelectItem>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date de début</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="rounded-md border"
        />
      </div>
    </div>
  );
};
