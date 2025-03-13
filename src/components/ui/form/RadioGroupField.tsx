
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormFieldProps } from "./FormField";
import { Label } from "@/components/ui/label";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  layout?: "horizontal" | "vertical" | "grid";
  columns?: number;
}

export function RadioGroupField({
  id,
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
  description,
  className,
  layout = "vertical",
  columns = 2,
}: RadioGroupFieldProps) {
  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-wrap gap-4";
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${columns} gap-4`;
      case "vertical":
      default:
        return "flex flex-col space-y-2";
    }
  };

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={getLayoutClass()}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label htmlFor={`${id}-${option.value}`} className="text-sm font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormField>
  );
}
