
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditNotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const EditNotesSection = ({ notes, onNotesChange }: EditNotesSectionProps) => {
  return (
    <div className="mt-4">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Notes ou informations supplémentaires..."
        className="min-h-[100px] mt-1"
      />
    </div>
  );
};
