
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SituationImmobiliere } from "@/types/client";

interface PropertyStatusFieldsProps {
  situationimmobiliere: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  onChange: (name: string, value) => void;
}

export function PropertyStatusFields({ situationimmobiliere, onChange }: PropertyStatusFieldsProps) {
  const showLoyer = situationimmobiliere.type === "locataire" || situationimmobiliere.type === "les_deux";
  const showValeur = situationimmobiliere.type === "proprietaire" || situationimmobiliere.type === "les_deux";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t">Situation immobilière</h3>

      <div>
        <Label htmlFor="statutImmo">Statut immobilier</Label>
        <Select
          value={situationimmobiliere.type || ""}
          onValueChange={(value) => onChange("situationimmobiliere.type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="locataire">Locataire</SelectItem>
            <SelectItem value="proprietaire">Propriétaire</SelectItem>
            <SelectItem value="les_deux">Les deux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showLoyer && (
          <div>
            <Label>Loyer mensuel (F CFA)</Label>
            <Input
              type="number"
              value={situationimmobiliere.loyer || ""}
              onChange={(e) => onChange("situationimmobiliere.loyer", e.target.value)}
              placeholder="Montant du loyer mensuel"
            />
          </div>
        )}

        {showValeur && (
          <div>
            <Label>Valeur du bien (F CFA)</Label>
            <Input
              type="number"
              value={situationimmobiliere.valeur || ""}
              onChange={(e) => onChange("situationimmobiliere.valeur", e.target.value)}
              placeholder="Valeur de l'immobilisation"
            />
          </div>
        )}
      </div>
    </div>
  );
}
