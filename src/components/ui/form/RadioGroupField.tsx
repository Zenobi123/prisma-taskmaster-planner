
import React from "react";
import { FormField } from "./FormField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  layout = "vertical",
  columns = 2,
  required = false,
  disabled = false,
  className = "",
  error,
}) => {
  const handleValueChange = (value: string) => {
    onChange(value);
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-wrap gap-4";
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${columns} gap-4`;
      default:
        return "space-y-2";
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
        onValueChange={handleValueChange}
        className={getLayoutClass()}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </FormField>
  );
};
