
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SituationImmobiliere } from "@/types/client";

interface PropertyStatusFieldsProps {
  situationimmobiliere: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  onChange: (name: string, value: any) => void;
}

export function PropertyStatusFields({ situationimmobiliere, onChange }: PropertyStatusFieldsProps) {
  return (
    <div className="space-y-4">
      <Label className="mb-2 block">Situation immobilière</Label>
      <RadioGroup
        value={situationimmobiliere.type}
        onValueChange={(value) => onChange("situationimmobiliere.type", value)}
        className="flex gap-4 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="proprietaire" id="proprietaire" />
          <Label htmlFor="proprietaire">Propriétaire</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="locataire" id="locataire" />
          <Label htmlFor="locataire">Locataire</Label>
        </div>
      </RadioGroup>

      {situationimmobiliere.type === "proprietaire" ? (
        <div>
          <Label>Valeur de l'immobilisation</Label>
          <Input
            type="number"
            value={situationimmobiliere.valeur || ""}
            onChange={(e) => onChange("situationimmobiliere.valeur", e.target.value)}
            placeholder="Valeur en FCFA"
          />
        </div>
      ) : (
        <div>
          <Label>Montant du loyer mensuel</Label>
          <Input
            type="number"
            value={situationimmobiliere.loyer || ""}
            onChange={(e) => onChange("situationimmobiliere.loyer", e.target.value)}
            placeholder="Montant en FCFA"
          />
        </div>
      )}
    </div>
  );
}
