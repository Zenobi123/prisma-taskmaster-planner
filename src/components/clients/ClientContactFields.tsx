
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientContactFieldsProps {
  telephone: string;
  email: string;
  onChange: (name: string, value: string) => void;
}

export function ClientContactFields({ telephone, email, onChange }: ClientContactFieldsProps) {
  return (
    <>
      <div>
        <Label>Téléphone</Label>
        <Input 
          type="tel" 
          required 
          value={telephone}
          onChange={(e) => onChange("telephone", e.target.value)}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input 
          type="email" 
          required 
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
    </>
  );
}
