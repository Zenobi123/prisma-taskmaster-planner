
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
}

const RadioGroupField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  className,
  layout = "vertical",
  columns = 3,
}: RadioGroupFieldProps) => {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={
          layout === "horizontal"
            ? "flex space-x-4"
            : layout === "grid"
            ? `grid grid-cols-1 md:grid-cols-${columns} gap-4`
            : "space-y-2"
        }
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} />
            <Label
              htmlFor={`${id}-${option.value}`}
              className="font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default RadioGroupField;
