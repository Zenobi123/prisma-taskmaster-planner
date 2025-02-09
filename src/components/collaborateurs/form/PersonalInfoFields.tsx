
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  datenaissance: string;
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoFields({
  nom,
  prenom,
  email,
  telephone,
  datenaissance,
  onChange,
}: PersonalInfoFieldsProps) {
  return (
    <>
      <div>
        <Label>Nom *</Label>
        <Input
          value={nom}
          onChange={(e) => onChange("nom", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Prénom *</Label>
        <Input
          value={prenom}
          onChange={(e) => onChange("prenom", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Téléphone</Label>
        <Input
          type="tel"
          value={telephone}
          onChange={(e) => onChange("telephone", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Date de naissance</Label>
        <Input
          type="date"
          value={datenaissance}
          onChange={(e) => onChange("datenaissance", e.target.value)}
          required
        />
      </div>
    </>
  );
}
