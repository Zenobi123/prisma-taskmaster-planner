
import React from "react";
import { FormField } from "./FormField";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  id: string;
  name?: string;
  label: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  error?: string;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  layout = "vertical",
  columns = 3,
  error,
}) => {
  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-row gap-4";
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${columns} gap-4`;
      case "vertical":
      default:
        return "flex flex-col space-y-2";
    }
  };

  return (
    <FormField
      name={name || id}
      label={label}
      required={required}
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={getLayoutClass()}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${id}-${option.value}`}
              disabled={disabled}
            />
            <Label htmlFor={`${id}-${option.value}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
