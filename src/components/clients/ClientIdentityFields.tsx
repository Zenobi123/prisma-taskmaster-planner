
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientType, Sexe, EtatCivil, RegimeFiscal } from "@/types/client";

interface ClientIdentityFieldsProps {
  type: ClientType;
  nom: string;
  raisonsociale: string;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  regimefiscal?: RegimeFiscal;
  onChange: (name: string, value: string) => void;
}

export function ClientIdentityFields({ 
  type, 
  nom, 
  raisonsociale, 
  sexe,
  etatcivil,
  regimefiscal,
  onChange 
}: ClientIdentityFieldsProps) {
  if (type === "physique") {
    return (
      <div className="space-y-6">
        <div>
          <Label>Nom et prénoms</Label>
          <Input 
            required 
            value={nom}
            onChange={(e) => onChange("nom", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2 block">Sexe</Label>
          <RadioGroup
            value={sexe}
            onValueChange={(value) => onChange("sexe", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="homme" id="homme" />
              <Label htmlFor="homme">Homme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="femme" id="femme" />
              <Label htmlFor="femme">Femme</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">État civil</Label>
          <RadioGroup
            value={etatcivil}
            onValueChange={(value) => onChange("etatcivil", value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="celibataire" id="celibataire" />
              <Label htmlFor="celibataire">Célibataire</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="marie" id="marie" />
              <Label htmlFor="marie">Marié(e)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="divorce" id="divorce" />
              <Label htmlFor="divorce">Divorcé(e)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="veuf" id="veuf" />
              <Label htmlFor="veuf">Veuf/Veuve</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">Régime fiscal</Label>
          <RadioGroup
            value={regimefiscal}
            onValueChange={(value) => onChange("regimefiscal", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reel" id="reel" />
              <Label htmlFor="reel">Réel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="simplifie" id="simplifie" />
              <Label htmlFor="simplifie">Simplifié</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Label>Raison sociale</Label>
      <Input 
        required 
        value={raisonsociale}
        onChange={(e) => onChange("raisonsociale", e.target.value)}
      />
    </div>
  );
}
