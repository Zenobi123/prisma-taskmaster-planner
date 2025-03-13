
import React from "react";
import { FormField } from "./FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = "Sélectionner...",
  className = "",
  error,
}) => {
  const handleValueChange = (value: string) => {
    onChange(value);
  };

  return (
    <FormField
      name={name || id}
      label={label}
      required={required}
      className={className}
    >
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
