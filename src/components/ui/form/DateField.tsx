
import React from "react";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";

interface DateFieldProps {
  id: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <FormField
      name={name || id}
      label={label}
      required={required}
      className={className}
    >
      <Input
        id={id}
        name={name || id}
        type="date"
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
