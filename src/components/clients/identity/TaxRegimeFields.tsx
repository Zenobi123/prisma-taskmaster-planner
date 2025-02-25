
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientType, RegimeFiscalPhysique, RegimeFiscalMorale } from "@/types/client";

interface TaxRegimeFieldsProps {
  type: ClientType;
  regimefiscal?: RegimeFiscalPhysique | RegimeFiscalMorale;
  onChange: (name: string, value: any) => void;
}

export function TaxRegimeFields({ type, regimefiscal, onChange }: TaxRegimeFieldsProps) {
  if (type === "physique") {
    return (
      <div>
        <Label className="mb-2 block">Régime fiscal</Label>
        <RadioGroup
          value={regimefiscal}
          onValueChange={(value) => onChange("regimefiscal", value)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reel" id="reel" />
            <Label htmlFor="reel">Réel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simplifie" id="simplifie" />
            <Label htmlFor="simplifie">Simplifié</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="liberatoire" id="liberatoire" />
            <Label htmlFor="liberatoire">Libératoire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non_professionnel_public" id="non_professionnel_public" />
            <Label htmlFor="non_professionnel_public" className="text-sm">Non professionnel (Secteur public)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non_professionnel_prive" id="non_professionnel_prive" />
            <Label htmlFor="non_professionnel_prive" className="text-sm">Non professionnel (Secteur privé)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non_professionnel_autre" id="non_professionnel_autre" />
            <Label htmlFor="non_professionnel_autre" className="text-sm">Non professionnel (Autres)</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  return (
    <div>
      <Label className="mb-2 block">Régime fiscal</Label>
      <RadioGroup
        value={regimefiscal}
        onValueChange={(value) => onChange("regimefiscal", value)}
        className="grid grid-cols-1 gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="reel" id="reel_morale" />
          <Label htmlFor="reel_morale">Réel</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="simplifie" id="simplifie_morale" />
          <Label htmlFor="simplifie_morale">Simplifié</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="non_lucratif" id="non_lucratif" />
          <Label htmlFor="non_lucratif">Organisme à but non lucratif</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
