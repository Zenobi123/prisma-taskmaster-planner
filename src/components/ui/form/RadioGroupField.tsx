
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormFieldProps } from "./FormField";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  disabled?: boolean;
}

export function RadioGroupField({
  id,
  label,
  value,
  onChange,
  options,
  layout = "vertical",
  columns = 3,
  required,
  disabled,
  error,
  description,
  className,
}: RadioGroupFieldProps) {
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
        className={cn(
          layout === "vertical" && "flex flex-col space-y-2",
          layout === "horizontal" && "flex space-x-4",
          layout === "grid" && `grid grid-cols-${columns} gap-4`
        )}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} />
            <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormField>
  );
}
