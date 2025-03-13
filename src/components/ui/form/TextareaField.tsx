
import React from "react";
import { FormField } from "./FormField";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  rows = 3,
  className = "",
}) => {
  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={className}
    >
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
      />
    </FormField>
  );
};
