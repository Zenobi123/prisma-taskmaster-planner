
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientProfessionalFieldsProps {
  niu: string;
  centrerattachement: string;
  secteuractivite: string;
  numerocnps: string;
  onChange: (name: string, value: string) => void;
}

export function ClientProfessionalFields({
  niu,
  centrerattachement,
  secteuractivite,
  numerocnps,
  onChange
}: ClientProfessionalFieldsProps) {
  return (
    <>
      <div>
        <Label>NIU</Label>
        <Input 
          required 
          value={niu}
          onChange={(e) => onChange("niu", e.target.value)}
        />
      </div>

      <div>
        <Label>Centre de Rattachement</Label>
        <Input 
          required 
          value={centrerattachement}
          onChange={(e) => onChange("centrerattachement", e.target.value)}
        />
      </div>

      <div>
        <Label>Secteur d'activité</Label>
        <Select 
          required
          value={secteuractivite} 
          onValueChange={(value) => onChange("secteuractivite", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="industrie">Industrie</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Numéro CNPS (optionnel)</Label>
        <Input 
          value={numerocnps}
          onChange={(e) => onChange("numerocnps", e.target.value)}
        />
      </div>
    </>
  );
}
