
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientContactFieldsProps {
  telephone: string;
  email: string;
  onChange: (name: string, value: string) => void;
}

const PHONE_REGEX = /^[0-9+\-\s()]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ClientContactFields({ telephone, email, onChange }: ClientContactFieldsProps) {
  const [errors, setErrors] = useState<{ telephone?: string; email?: string }>({});

  const handlePhoneChange = (value: string) => {
    if (!PHONE_REGEX.test(value)) {
      setErrors(prev => ({ ...prev, telephone: "Format invalide. Utilisez uniquement des chiffres, +, -, espaces et parenthèses." }));
    } else {
      setErrors(prev => ({ ...prev, telephone: undefined }));
    }
    onChange("telephone", value);
  };

  const handleEmailChange = (value: string) => {
    if (value && !EMAIL_REGEX.test(value)) {
      setErrors(prev => ({ ...prev, email: "Adresse email invalide." }));
    } else {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    onChange("email", value);
  };

  return (
    <>
      <div>
        <Label>Téléphone</Label>
        <Input
          type="tel"
          required
          value={telephone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          pattern="[0-9+\-\s()]{6,20}"
          maxLength={20}
        />
        {errors.telephone && (
          <p className="text-sm text-destructive mt-1">{errors.telephone}</p>
        )}
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          maxLength={254}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>
    </>
  );
}
