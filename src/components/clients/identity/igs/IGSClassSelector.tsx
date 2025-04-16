
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CGAClasse } from "@/hooks/fiscal/types";

// Interface pour la structure de données des classes IGS avec leurs tranches et montants
interface IGSClasseInfo {
  tranche: string;
  montant: number;
}

// Tableau des informations pour chaque classe IGS avec les montants corrigés
export const igsClassesInfo: Record<string, IGSClasseInfo> = {
  "classe1": { tranche: "Moins de 500 000", montant: 20000 },
  "classe2": { tranche: "500 000 à 1 000 000", montant: 30000 },
  "classe3": { tranche: "1 000 000 à 1 500 000", montant: 40000 },
  "classe4": { tranche: "1 500 000 à 2 000 000", montant: 50000 },
  "classe5": { tranche: "2 000 000 à 2 500 000", montant: 60000 },
  "classe6": { tranche: "2 500 000 à 4 999 999", montant: 150000 },
  "classe7": { tranche: "5 000 000 à 9 999 999", montant: 300000 },
  "classe8": { tranche: "10 000 000 à 19 999 999", montant: 500000 },
  "classe9": { tranche: "20 000 000 à 29 999 999", montant: 1000000 },
  "classe10": { tranche: "30 000 000 à 49 999 999", montant: 2000000 },
};

interface IGSClassSelectorProps {
  classeIGS?: CGAClasse;
  onChange: (name: string, value: any) => void;
}

export function IGSClassSelector({ classeIGS, onChange }: IGSClassSelectorProps) {
  return (
    <div>
      <Label className="mb-2 block">Classe IGS</Label>
      <RadioGroup
        value={classeIGS || "classe1"}
        onValueChange={(value) => onChange("igs.classeIGS", value as CGAClasse)}
        className="grid grid-cols-2 gap-4"
      >
        {Object.entries(igsClassesInfo).map(([classe, info]) => (
          <div key={classe} className="flex items-center space-x-2">
            <RadioGroupItem value={classe} id={classe} />
            <Label htmlFor={classe} className="flex flex-col">
              <span>Classe {classe.replace('classe', '')}</span>
              <span className="text-xs text-gray-500">{info.tranche} FCFA</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
