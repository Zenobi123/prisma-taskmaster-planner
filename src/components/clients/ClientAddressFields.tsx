
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientAddressFieldsProps {
  ville: string;
  quartier: string;
  lieuDit: string;
  onChange: (name: string, value: string) => void;
}

export function ClientAddressFields({ ville, quartier, lieuDit, onChange }: ClientAddressFieldsProps) {
  return (
    <>
      <div>
        <Label>Ville</Label>
        <Input 
          required 
          value={ville}
          onChange={(e) => onChange("ville", e.target.value)}
        />
      </div>

      <div>
        <Label>Quartier</Label>
        <Input 
          required 
          value={quartier}
          onChange={(e) => onChange("quartier", e.target.value)}
        />
      </div>

      <div>
        <Label>Lieu-dit</Label>
        <Input 
          value={lieuDit}
          onChange={(e) => onChange("lieuDit", e.target.value)}
        />
      </div>
    </>
  );
}
