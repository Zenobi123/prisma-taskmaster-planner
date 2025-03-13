
import React from "react";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder,
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
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </FormField>
  );
};
