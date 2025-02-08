
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClientType } from "@/types/client";

interface ClientTypeSelectProps {
  type: ClientType;
  onTypeChange: (value: ClientType) => void;
}

export function ClientTypeSelect({ type, onTypeChange }: ClientTypeSelectProps) {
  return (
    <div>
      <Label>Type de client</Label>
      <Select value={type} onValueChange={onTypeChange} required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="physique">Personne Physique</SelectItem>
          <SelectItem value="morale">Personne Morale</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
