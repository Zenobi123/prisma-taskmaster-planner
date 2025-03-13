
import React from "react";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";

interface TextFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  value,
  type = "text",
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  className = "",
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
