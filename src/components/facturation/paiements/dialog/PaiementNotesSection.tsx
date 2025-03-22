
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PaiementNotesSectionProps {
  register: any;
}

export const PaiementNotesSection = ({
  register
}: PaiementNotesSectionProps) => {
  return (
    <div className="grid gap-1">
      <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
      <Textarea
        id="notes"
        {...register("notes")}
        placeholder="Informations supplémentaires..."
        className="h-16 text-xs resize-none"
      />
    </div>
  );
};
