
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote } from "lucide-react";

interface PaiementNotesSectionProps {
  register: any;
}

export const PaiementNotesSection = ({
  register
}: PaiementNotesSectionProps) => {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="notes" className="text-xs font-medium flex items-center gap-1.5">
        <StickyNote size={14} className="text-gray-500" />
        Notes
      </Label>
      <Textarea
        id="notes"
        {...register("notes")}
        placeholder="Informations supplémentaires..."
        className="min-h-[60px] text-sm resize-none bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
    </div>
  );
};
