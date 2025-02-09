
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFieldsProps {
  ville: string;
  quartier: string;
  onChange: (field: string, value: string) => void;
}

export function AddressFields({
  ville,
  quartier,
  onChange,
}: AddressFieldsProps) {
  return (
    <>
      <div>
        <Label>Ville</Label>
        <Input
          value={ville}
          onChange={(e) => onChange("ville", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Quartier</Label>
        <Input
          value={quartier}
          onChange={(e) => onChange("quartier", e.target.value)}
          required
        />
      </div>
    </>
  );
}
