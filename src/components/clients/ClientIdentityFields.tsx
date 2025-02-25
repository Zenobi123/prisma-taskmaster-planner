
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientType, Sexe, EtatCivil, RegimeFiscal, SituationImmobiliere } from "@/types/client";

interface ClientIdentityFieldsProps {
  type: ClientType;
  nom: string;
  raisonsociale: string;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  regimefiscal?: RegimeFiscal;
  situationimmobiliere?: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  onChange: (name: string, value: any) => void;
}

export function ClientIdentityFields({ 
  type, 
  nom, 
  raisonsociale,
  sexe,
  etatcivil,
  regimefiscal,
  situationimmobiliere,
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

        <div className="space-y-4">
          <Label className="mb-2 block">Situation immobilière</Label>
          <RadioGroup
            value={situationimmobiliere?.type}
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

          {situationimmobiliere?.type === "proprietaire" ? (
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
                value={situationimmobiliere?.loyer || ""}
                onChange={(e) => onChange("situationimmobiliere.loyer", e.target.value)}
                placeholder="Montant en FCFA"
              />
            </div>
          )}
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
