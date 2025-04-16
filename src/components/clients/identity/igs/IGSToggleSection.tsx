
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface IGSToggleSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  onChange: (name: string, value: any) => void;
}

export function IGSToggleSection({ 
  soumisIGS, 
  adherentCGA, 
  onChange 
}: IGSToggleSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block font-medium">Soumis à l'Impôt Général Synthétique (IGS)</Label>
        <RadioGroup
          value={soumisIGS ? "true" : "false"}
          onValueChange={(value) => onChange("igs.soumisIGS", value === "true")}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="soumis_igs_oui" />
            <Label htmlFor="soumis_igs_oui">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="soumis_igs_non" />
            <Label htmlFor="soumis_igs_non">Non</Label>
          </div>
        </RadioGroup>
      </div>

      {soumisIGS && (
        <div>
          <Label className="mb-2 block">Adhérent Centre de Gestion Agréé (CGA)</Label>
          <RadioGroup
            value={adherentCGA ? "true" : "false"}
            onValueChange={(value) => onChange("igs.adherentCGA", value === "true")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="adherent_cga_oui" />
              <Label htmlFor="adherent_cga_oui">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="adherent_cga_non" />
              <Label htmlFor="adherent_cga_non">Non</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
