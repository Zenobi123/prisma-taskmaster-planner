
import React from "react";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";

interface TextFieldProps {
  id: string;
  name?: string;
  label: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  type?: string;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  type = "text",
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
