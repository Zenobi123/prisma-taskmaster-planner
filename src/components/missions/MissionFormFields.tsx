
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
        <Label htmlFor="client">Client</Label>
        <Select name="client_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client1">SARL TechPro</SelectItem>
            <SelectItem value="client2">SAS WebDev</SelectItem>
            <SelectItem value="client3">EURL ConseilPlus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assignedTo">Assigné à</Label>
        <Select name="collaborateur_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Assigné à" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="collab1">Sophie Martin</SelectItem>
            <SelectItem value="collab2">Pierre Dubois</SelectItem>
            <SelectItem value="collab3">Marie Lambert</SelectItem>
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
