
import React from "react";
import { FormField } from "./FormField";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
  error?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  rows = 3,
  className = "",
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormField
      name={name || id}
      label={label}
      required={required}
      className={className}
    >
      <Textarea
        id={id}
        name={name || id}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
