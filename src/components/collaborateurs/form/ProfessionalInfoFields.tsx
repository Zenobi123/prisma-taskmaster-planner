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
import { ScrollArea } from "@/components/ui/scroll-area";

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
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="max-h-[200px]">
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Niveau d'étude</Label>
        <Select
          value={niveauetude}
          onValueChange={(value) => onChange("niveauetude", value)}
        >
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionner un niveau d'étude" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="max-h-[200px]">
              {niveauxEtude.map((niveau) => (
                <SelectItem key={niveau} value={niveau}>
                  {niveau}
                </SelectItem>
              ))}
            </ScrollArea>
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
