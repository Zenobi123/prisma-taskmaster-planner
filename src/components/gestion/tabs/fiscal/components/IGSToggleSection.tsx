
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IGSToggleSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  onSoumisIGSChange: (checked: boolean) => void;
  onAdherentCGAChange: (checked: boolean) => void;
}

export function IGSToggleSection({
  soumisIGS,
  adherentCGA,
  onSoumisIGSChange,
  onAdherentCGAChange,
}: IGSToggleSectionProps) {
  return (
    <div className="flex flex-col space-y-4">
      {/* IGS Status Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="soumis-igs"
          checked={soumisIGS}
          onCheckedChange={onSoumisIGSChange}
        />
        <Label htmlFor="soumis-igs">
          {soumisIGS ? "Soumis à l'IGS" : "Non soumis à l'IGS"}
        </Label>
      </div>
      
      {soumisIGS && (
        /* CGA Status Toggle */
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id="adherent-cga"
            checked={adherentCGA}
            onCheckedChange={onAdherentCGAChange}
          />
          <Label htmlFor="adherent-cga">
            {adherentCGA ? "Adhérent CGA" : "Non adhérent CGA"}
          </Label>
        </div>
      )}
    </div>
  );
}
