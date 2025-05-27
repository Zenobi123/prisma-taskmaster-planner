
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RegimeFiscal } from "@/types/client";

interface ClientProfessionalFieldsProps {
  niu: string;
  centrerattachement: string;
  secteuractivite: string;
  numerocnps: string;
  regimefiscal: RegimeFiscal;
  gestionexternalisee: boolean;
  onChange: (name: string, value: string | boolean) => void;
}

export function ClientProfessionalFields({
  niu,
  centrerattachement,
  secteuractivite,
  numerocnps,
  regimefiscal,
  gestionexternalisee,
  onChange,
}: ClientProfessionalFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="niu">NIU</Label>
        <Input
          id="niu"
          name="niu"
          value={niu}
          onChange={(e) => onChange("niu", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="centrerattachement">Centre de rattachement</Label>
        <Input
          id="centrerattachement"
          name="centrerattachement"
          value={centrerattachement}
          onChange={(e) => onChange("centrerattachement", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="secteuractivite">Secteur d'activité</Label>
        <Select
          value={secteuractivite}
          onValueChange={(value) => onChange("secteuractivite", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un secteur d'activité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="industrie">Industrie</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="numerocnps">Numéro CNPS (optionnel)</Label>
        <Input
          id="numerocnps"
          name="numerocnps"
          value={numerocnps}
          onChange={(e) => onChange("numerocnps", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="regimefiscal">Régime fiscal *</Label>
        <Select
          value={regimefiscal}
          onValueChange={(value) => onChange("regimefiscal", value as RegimeFiscal)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le régime fiscal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reel">Régime Réel</SelectItem>
            <SelectItem value="igs">Impôt Général Synthétique (IGS)</SelectItem>
            <SelectItem value="non_professionnel">Non Professionnel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="gestionexternalisee"
          checked={gestionexternalisee}
          onCheckedChange={(checked) => 
            onChange("gestionexternalisee", checked === true)
          }
        />
        <Label htmlFor="gestionexternalisee" className="font-medium cursor-pointer">
          Gestion du dossier
        </Label>
      </div>
    </div>
  );
}
