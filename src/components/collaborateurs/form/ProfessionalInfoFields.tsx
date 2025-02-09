
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollaborateurRole } from "@/types/collaborateur";

interface ProfessionalInfoFieldsProps {
  poste: CollaborateurRole;
  niveauetude: string;
  dateentree: string;
  onChange: (field: string, value: string) => void;
}

const roles: CollaborateurRole[] = [
  "expert-comptable",
  "assistant",
  "fiscaliste",
  "gestionnaire",
  "comptable",
];

const niveauxEtude = [
  "BAC",
  "BAC+2",
  "BAC+3",
  "BAC+4",
  "BAC+5",
  "BAC+6 et plus"
];

export function ProfessionalInfoFields({
  poste,
  niveauetude,
  dateentree,
  onChange,
}: ProfessionalInfoFieldsProps) {
  return (
    <>
      <div>
        <Label>Rôle</Label>
        <Select
          value={poste}
          onValueChange={(value: CollaborateurRole) => onChange("poste", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Niveau d'étude</Label>
        <Select
          value={niveauetude}
          onValueChange={(value) => onChange("niveauetude", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un niveau d'étude" />
          </SelectTrigger>
          <SelectContent>
            {niveauxEtude.map((niveau) => (
              <SelectItem key={niveau} value={niveau}>
                {niveau}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date d'entrée</Label>
        <Input
          type="date"
          value={dateentree}
          onChange={(e) => onChange("dateentree", e.target.value)}
          required
        />
      </div>
    </>
  );
}
