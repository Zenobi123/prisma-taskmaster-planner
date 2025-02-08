
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientType } from "@/types/client";

interface ClientIdentityFieldsProps {
  type: ClientType;
  nom: string;
  raisonsociale: string;
  onChange: (name: string, value: string) => void;
}

export function ClientIdentityFields({ type, nom, raisonsociale, onChange }: ClientIdentityFieldsProps) {
  if (type === "physique") {
    return (
      <div>
        <Label>Nom et prénoms</Label>
        <Input 
          required 
          value={nom}
          onChange={(e) => onChange("nom", e.target.value)}
        />
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
