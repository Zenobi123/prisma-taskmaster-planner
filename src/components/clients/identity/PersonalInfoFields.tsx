
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sexe, EtatCivil } from "@/types/client";

interface PersonalInfoFieldsProps {
  nom: string;
  nomcommercial?: string;
  numerorccm?: string;
  sexe: Sexe;
  etatcivil: EtatCivil;
  onChange: (name: string, value: any) => void;
}

export function PersonalInfoFields({ 
  nom, 
  nomcommercial = "",
  numerorccm = "",
  sexe, 
  etatcivil, 
  onChange 
}: PersonalInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom et prénoms *</Label>
          <Input
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => onChange("nom", e.target.value)}
            placeholder="Entrez le nom et prénoms"
            required
          />
        </div>

        <div>
          <Label htmlFor="nomcommercial">Nom commercial</Label>
          <Input
            id="nomcommercial"
            type="text"
            value={nomcommercial}
            onChange={(e) => onChange("nomcommercial", e.target.value)}
            placeholder="Nom commercial (optionnel)"
          />
        </div>

        <div>
          <Label htmlFor="numerorccm">Numéro de RCCM</Label>
          <Input
            id="numerorccm"
            type="text"
            value={numerorccm}
            onChange={(e) => onChange("numerorccm", e.target.value)}
            placeholder="Numéro de RCCM (optionnel)"
          />
        </div>

        <div>
          <Label htmlFor="sexe">Sexe *</Label>
          <RadioGroup
            value={sexe}
            onValueChange={(value) => onChange("sexe", value as Sexe)}
            className="flex flex-row space-x-4 mt-2"
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
          <Label htmlFor="etatcivil">État civil *</Label>
          <Select value={etatcivil} onValueChange={(value) => onChange("etatcivil", value as EtatCivil)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez l'état civil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="celibataire">Célibataire</SelectItem>
              <SelectItem value="marie">Marié(e)</SelectItem>
              <SelectItem value="divorce">Divorcé(e)</SelectItem>
              <SelectItem value="veuf">Veuf/Veuve</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
