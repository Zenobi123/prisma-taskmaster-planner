
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientType, Sexe, EtatCivil, RegimeFiscalPhysique, RegimeFiscalMorale, SituationImmobiliere, FormeJuridique } from "@/types/client";

interface ClientIdentityFieldsProps {
  type: ClientType;
  nom: string;
  raisonsociale: string;
  sigle?: string;
  datecreation?: string;
  lieucreation?: string;
  nomdirigeant?: string;
  formejuridique?: FormeJuridique;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  regimefiscal?: RegimeFiscalPhysique | RegimeFiscalMorale;
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
  sigle,
  datecreation,
  lieucreation,
  nomdirigeant,
  formejuridique,
  sexe,
  etatcivil,
  regimefiscal,
  situationimmobiliere,
  onChange 
}: ClientIdentityFieldsProps) {
  const SituationImmobiliereFields = () => (
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
  );

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

        <SituationImmobiliereFields />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Raison sociale</Label>
        <Input 
          required 
          value={raisonsociale}
          onChange={(e) => onChange("raisonsociale", e.target.value)}
        />
      </div>

      <div>
        <Label>Sigle</Label>
        <Input
          value={sigle || ""}
          onChange={(e) => onChange("sigle", e.target.value)}
          placeholder="Sigle de l'entreprise"
        />
      </div>

      <div>
        <Label>Date de création</Label>
        <Input
          type="date"
          value={datecreation || ""}
          onChange={(e) => onChange("datecreation", e.target.value)}
        />
      </div>

      <div>
        <Label>Lieu de création</Label>
        <Input
          value={lieucreation || ""}
          onChange={(e) => onChange("lieucreation", e.target.value)}
          placeholder="Ville de création"
        />
      </div>

      <div>
        <Label>Nom du dirigeant</Label>
        <Input
          value={nomdirigeant || ""}
          onChange={(e) => onChange("nomdirigeant", e.target.value)}
          placeholder="Nom complet du dirigeant"
        />
      </div>

      <div>
        <Label>Forme juridique</Label>
        <Select
          value={formejuridique}
          onValueChange={(value) => onChange("formejuridique", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez la forme juridique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sa">Société Anonyme (SA)</SelectItem>
            <SelectItem value="sarl">Société à Responsabilité Limitée (SARL)</SelectItem>
            <SelectItem value="sas">Société par Actions Simplifiée (SAS)</SelectItem>
            <SelectItem value="snc">Société en Nom Collectif (SNC)</SelectItem>
            <SelectItem value="association">Association</SelectItem>
            <SelectItem value="gie">Groupement d'Intérêt Économique (GIE)</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      <SituationImmobiliereFields />
    </div>
  );
}
