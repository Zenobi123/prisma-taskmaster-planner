
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesFormProps {
  notes: string;
  setNotes: (value: string) => void;
}

export const NotesForm = ({ notes, setNotes }: NotesFormProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        placeholder="Notes ou informations supplémentaires..."
        value={notes || ""}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[80px]"
      />
    </div>
  );
};
