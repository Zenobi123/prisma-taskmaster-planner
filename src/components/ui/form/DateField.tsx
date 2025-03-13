
import React from "react";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";

interface DateFieldProps {
  name: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
    >
      <Input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </FormField>
  );
};
